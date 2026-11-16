import React, { useState, useEffect, useCallback, useRef } from 'react';
import CodingDashboard from './CodingDashboard';
import DsaSheetView from './DsaSheetView';
import cp31Catalogue from '../../data/cp31SheetData.json';
import cpCatalogue from '../../data/cpSheetData.json';
import CpSheetView from './CpSheetView';
import { fetchLeetCodeStats, fetchCodeforcesStats, leetcodeUsername } from '../../utils/codingApi';
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

  const lcHandle = leetcodeUsername(settings?.leetcodeHandle);
  const cfHandle = settings?.codeforcesHandle?.trim();
  const [lcLoading, setLcLoading] = useState(false);
  const activeLC = useRef(null);
  const latestStats = useRef(codingStats);
  latestStats.current = codingStats;

  function storeResult(platform, data) {
    const time = new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true
    });
    setCodingStats(prev => ({ ...prev, [platform]: data, lastSynced: `Today at ${time} IST` }));
  }

  const loadLeetcode = useCallback(async () => {
    if (!lcHandle) return;
    activeLC.current?.abort();
    const controller = new AbortController();
    activeLC.current = controller;
    setLcLoading(true);
    const data = await fetchLeetCodeStats(lcHandle, controller.signal);
    if (!controller.signal.aborted) {
      storeResult('leetcode', data);
      setLcLoading(false);
    }
  }, [lcHandle]);

  useEffect(() => {
    const cached = latestStats.current.leetcode;
    if (lcHandle && (cached?.handle !== lcHandle || cached.error || cached.attendedContestsCount == null ||
        !(Date.now() - Date.parse(cached.lastUpdated) < 300000))) loadLeetcode();
    else setLcLoading(false);
    return () => activeLC.current?.abort();
  }, [lcHandle, loadLeetcode]);

  const cfRequest = useRef(0);
  const loadCodeforces = useCallback(async () => {
    if (!cfHandle) return;
    const request = ++cfRequest.current;
    setIsLoading(true);
    try {
      const data = await fetchCodeforcesStats(cfHandle);
      if (request === cfRequest.current) storeResult('codeforces', data);
    } finally {
      if (request === cfRequest.current) setIsLoading(false);
    }
  }, [cfHandle]);

  useEffect(() => {
    if (cfHandle && latestStats.current.codeforces?.handle !== cfHandle) loadCodeforces();
    else setIsLoading(false);
    return () => { cfRequest.current++; };
  }, [cfHandle, loadCodeforces]);

  // Render subviews based on state
  return (
    <div>
      {/* 1. Default Landing Page: Coding Dashboard */}
      {currentView === 'dashboard' && (
        <CodingDashboard
          settings={{ ...settings, leetcodeHandle: lcHandle }}
          leetcodeData={codingStats.leetcode?.handle === lcHandle ? codingStats.leetcode : null}
          lcLoading={lcLoading}
          onRetryLeetcode={loadLeetcode}
          codeforcesData={codingStats.codeforces}
          isLoading={isLoading || lcLoading}
          lastSynced={codingStats.lastSynced}
          onRefresh={() => { loadLeetcode(); loadCodeforces(); }}
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
