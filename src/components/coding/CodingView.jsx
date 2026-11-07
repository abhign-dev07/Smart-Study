import React, { useState, useEffect, useCallback } from 'react';
import CodingDashboard from './CodingDashboard';
import DsaSheetView from './DsaSheetView';
import cp31Catalogue from '../../data/cp31SheetData.json';
import cpCatalogue from '../../data/cpSheetData.json';
import CpSheetView from './CpSheetView';
import { fetchLeetCodeStats, fetchCodeforcesStats } from '../../utils/codingApi';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/mockData';
import { ALL_STRIVER_PROBLEMS } from '../../data/striverSheetData';

export default function CodingView({ settings, setSettings }) {
  // Navigation state: 'dashboard' (Default view) | 'dsaSheet' | 'cpSheet'
  const [currentView, setCurrentView] = useState('dashboard');

  // Cached coding stats in localStorage
  const [codingStats, setCodingStats] = useState(() => 
    getStoredData(STORAGE_KEYS.CODING_STATS, {
      leetcode: null,
      codeforces: null,
      lastSynced: null
    })
  );

  const [isLoading, setIsLoading] = useState(false);

  // Sync coding stats to localStorage
  useEffect(() => {
    setStoredData(STORAGE_KEYS.CODING_STATS, codingStats);
  }, [codingStats]);

  // Read DSA progress count from localStorage to display on DSA Sheet card
  const dsaProgress = getStoredData(STORAGE_KEYS.DSA_SHEET, {});
  const dsaSolvedCount = ALL_STRIVER_PROBLEMS.filter(p => dsaProgress[p.id]?.solved).length;
  const cpProgress = getStoredData(STORAGE_KEYS.CP_SHEET_PROGRESS, {});
  const cpProblems = cpCatalogue.topics.flatMap(t => t.problems);
  const cpSolvedCount = cpProblems.filter(p => cpProgress[p.id]?.solved).length;
  const dsaTotalCount = ALL_STRIVER_PROBLEMS?.length || 495;

  // Fetch real statistics from LeetCode & Codeforces
  const loadPlatformStats = useCallback(async (force = false) => {
    const lcHandle = settings?.leetcodeHandle?.trim();
    const cfHandle = settings?.codeforcesHandle?.trim();

    if (!lcHandle && !cfHandle) {
      return;
    }

    setIsLoading(true);

    try {
      const promises = [];

      if (lcHandle) {
        promises.push(
          fetchLeetCodeStats(lcHandle).then(data => ({ platform: 'leetcode', data }))
        );
      } else {
        promises.push(Promise.resolve({ platform: 'leetcode', data: null }));
      }

      if (cfHandle) {
        promises.push(
          fetchCodeforcesStats(cfHandle).then(data => ({ platform: 'codeforces', data }))
        );
      } else {
        promises.push(Promise.resolve({ platform: 'codeforces', data: null }));
      }

      const results = await Promise.all(promises);

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const formattedSyncTime = `Today at ${timeStr} IST`;

      setCodingStats(prev => {
        const next = { ...prev, lastSynced: formattedSyncTime };
        results.forEach(res => {
          if (res.platform === 'leetcode') next.leetcode = res.data;
          if (res.platform === 'codeforces') next.codeforces = res.data;
        });
        return next;
      });
    } catch (err) {
      console.error('Error fetching platform statistics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [settings?.leetcodeHandle, settings?.codeforcesHandle]);

  // Initial fetch on mount or handle change if handles are configured and not yet fetched
  useEffect(() => {
    const lcHandle = settings?.leetcodeHandle?.trim();
    const cfHandle = settings?.codeforcesHandle?.trim();

    const needLC = lcHandle && (!codingStats.leetcode || codingStats.leetcode.handle !== lcHandle);
    const needCF = cfHandle && (!codingStats.codeforces || codingStats.codeforces.handle !== cfHandle);

    if (needLC || needCF) {
      loadPlatformStats();
    }
  }, [settings?.leetcodeHandle, settings?.codeforcesHandle, loadPlatformStats]);

  // Render subviews based on state
  return (
    <div>
      {/* 1. Default Landing Page: Coding Dashboard */}
      {currentView === 'dashboard' && (
        <CodingDashboard
          settings={settings}
          leetcodeData={codingStats.leetcode}
          codeforcesData={codingStats.codeforces}
          isLoading={isLoading}
          lastSynced={codingStats.lastSynced}
          onRefresh={() => loadPlatformStats(true)}
          onOpenSettings={() => {
            // Trigger configuration / settings modal
            const settingsBtn = document.querySelector('button[title="System Settings"]');
            if (settingsBtn) settingsBtn.click();
          }}
          onOpenDsaSheet={() => setCurrentView('dsaSheet')}
          onOpenCp31={() => setCurrentView('cp31')}
          onOpenCpSheet={() => setCurrentView('cpSheet')}
          dsaSolvedCount={dsaSolvedCount}
          dsaTotalCount={dsaTotalCount}
          cpSolvedCount={cpSolvedCount}
          cpTotalCount={cpProblems.length}
        />
      )}

      {/* 2. DSA Sheet View (Opens ONLY when DSA Sheet card is clicked) */}
      {currentView === 'dsaSheet' && (
        <DsaSheetView onBack={() => setCurrentView('dashboard')} />
      )}

      {currentView === 'cp31' && <CpSheetView key="cp31" catalogue={cp31Catalogue} storageKey={STORAGE_KEYS.CP31_PROGRESS} onBack={() => setCurrentView('dashboard')} />}

      {/* 3. CP Sheet View (Opens ONLY when CP Sheet card is clicked) */}
      {currentView === 'cpSheet' && (
        <CpSheetView onBack={() => setCurrentView('dashboard')} />
      )}
    </div>
  );
}
