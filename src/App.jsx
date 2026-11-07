import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Code2, Settings, 
  Flame, Bell, Search, ExternalLink 
} from 'lucide-react';
import DashboardView from './components/dashboard/DashboardView';
import AcademicsView from './components/academics/AcademicsView';
import CodingView from './components/coding/CodingView';
import SettingsModal from './components/settings/SettingsModal';
import { 
  STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_SUBJECTS, 
  DEFAULT_TASKS, DEFAULT_ASSIGNMENTS, DEFAULT_EXAMS, 
  DEFAULT_SESSIONS, getStoredData, setStoredData 
} from './utils/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'academics' | 'coding'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Core state synced with localStorage
  const [settings, setSettings] = useState(() => getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
  const [subjects, setSubjects] = useState(() => getStoredData(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS));
  const [tasks, setTasks] = useState(() => getStoredData(STORAGE_KEYS.TASKS, DEFAULT_TASKS));
  const [assignments, setAssignments] = useState(() => getStoredData(STORAGE_KEYS.ASSIGNMENTS, DEFAULT_ASSIGNMENTS));
  const [exams, setExams] = useState(() => getStoredData(STORAGE_KEYS.EXAMS, DEFAULT_EXAMS));
  const [sessions, setSessions] = useState(() => getStoredData(STORAGE_KEYS.STUDY_SESSIONS, DEFAULT_SESSIONS));

  // Sync back to storage on state change
  useEffect(() => { setStoredData(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { setStoredData(STORAGE_KEYS.SUBJECTS, subjects); }, [subjects]);
  useEffect(() => { setStoredData(STORAGE_KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { setStoredData(STORAGE_KEYS.ASSIGNMENTS, assignments); }, [assignments]);
  useEffect(() => { setStoredData(STORAGE_KEYS.EXAMS, exams); }, [exams]);
  useEffect(() => { setStoredData(STORAGE_KEYS.STUDY_SESSIONS, sessions); }, [sessions]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              Study Command Centre
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">v1.0</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">IST (UTC+05:30) Active</div>
          </div>
        </div>

        {/* 3 Primary Navigation Sections */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/5 shadow-inner">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('academics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'academics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Academics</span>
          </button>
          <button
            onClick={() => setActiveTab('coding')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'coding'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Coding</span>
          </button>
        </nav>

        {/* Header Actions (Settings Modal trigger) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="System Settings"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            setTasks={setTasks}
            subjects={subjects}
            assignments={assignments}
            exams={exams}
            sessions={sessions}
            setSessions={setSessions}
            settings={settings}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'academics' && (
          <AcademicsView
            subjects={subjects}
            setSubjects={setSubjects}
            assignments={assignments}
            setAssignments={setAssignments}
            exams={exams}
            setExams={setExams}
          />
        )}

        {activeTab === 'coding' && (
          <CodingView settings={settings} setSettings={setSettings} />
        )}
      </main>

      {/* Secondary Settings Slide-over / Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  );
}
