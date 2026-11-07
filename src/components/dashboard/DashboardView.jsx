import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Square, Flame, CheckCircle2, Clock, 
  ArrowUpRight, BookOpen, Code2, Plus, Sparkles, Check, 
  Pencil, Trash2, X, AlertCircle 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { getISTDateString, calculateStreaks } from '../../utils/mockData';

export default function DashboardView({ 
  tasks, setTasks, 
  subjects, 
  assignments, 
  exams, 
  sessions, setSessions,
  settings,
  onNavigate 
}) {
  // Timer state
  const [timerType, setTimerType] = useState('pomodoro'); // 'pomodoro' | 'custom'
  const [pomodoroMode, setPomodoroMode] = useState('focus'); // 'focus' (25m) | 'shortBreak' (5m) | 'longBreak' (15m)
  
  // Custom timer inputs
  const [customMinutes, setCustomMinutes] = useState(45);
  const [customHours, setCustomHours] = useState(0);

  // Remaining seconds
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [initialDuration, setInitialDuration] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSubject, setActiveSubject] = useState('');

  // Timestamp references to calculate precise elapsed time without relying on tick intervals
  const sessionStartTimeRef = useRef(null);
  const sessionAccumulatedSecsRef = useRef(0);

  // Quick task state
  const [quickTaskText, setQuickTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  // Handle countdown accurately
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      if (!sessionStartTimeRef.current) {
        sessionStartTimeRef.current = Date.now();
      }

      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Natural completion of timer
            finishSession(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Record elapsed session into sessions state
  const finishSession = (isCompleted = false) => {
    setIsRunning(false);
    let elapsedSeconds = sessionAccumulatedSecsRef.current;
    if (sessionStartTimeRef.current) {
      elapsedSeconds += Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
    }

    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    sessionStartTimeRef.current = null;
    sessionAccumulatedSecsRef.current = 0;

    // Only record if study mode (not break) and has at least 1 minute of genuine elapsed study
    const isStudySession = (timerType === 'custom') || (timerType === 'pomodoro' && pomodoroMode === 'focus');
    if (isStudySession && elapsedMinutes >= 1) {
      const todayIST = getISTDateString();
      const newSession = {
        id: 'ses-' + Date.now(),
        date: todayIST,
        durationMinutes: elapsedMinutes,
        subjectId: activeSubject || null,
        mode: timerType === 'pomodoro' ? 'pomodoro' : 'custom',
        completedNaturally: isCompleted,
        timestamp: new Date().toISOString()
      };
      setSessions(prev => [newSession, ...prev]);
    }

    // Reset secondsLeft to planned
    setSecondsLeft(initialDuration);
  };

  const handleStartResume = () => {
    sessionStartTimeRef.current = Date.now();
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (sessionStartTimeRef.current) {
      sessionAccumulatedSecsRef.current += Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      sessionStartTimeRef.current = null;
    }
  };

  const handleStopAndSave = () => {
    if (window.confirm("Stop and record genuine elapsed study time for this session?")) {
      finishSession(false);
    }
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    sessionStartTimeRef.current = null;
    sessionAccumulatedSecsRef.current = 0;
    setSecondsLeft(initialDuration);
  };

  // Switch Pomodoro mode
  const switchPomodoro = (mode, minutes) => {
    if (isRunning) {
      handlePause();
    }
    setTimerType('pomodoro');
    setPomodoroMode(mode);
    const secs = minutes * 60;
    setInitialDuration(secs);
    setSecondsLeft(secs);
    sessionStartTimeRef.current = null;
    sessionAccumulatedSecsRef.current = 0;
  };

  // Set Custom duration
  const applyCustomDuration = (hrs, mins) => {
    if (isRunning) {
      handlePause();
    }
    const totalSecs = (hrs * 3600) + (mins * 60);
    if (totalSecs <= 0) return;
    setTimerType('custom');
    setCustomHours(hrs);
    setCustomMinutes(mins);
    setInitialDuration(totalSecs);
    setSecondsLeft(totalSecs);
    sessionStartTimeRef.current = null;
    sessionAccumulatedSecsRef.current = 0;
  };

  const formatTime = (totalSec) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Task actions
  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const saveEditTask = (taskId) => {
    if (!editingTaskTitle.trim()) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, title: editingTaskTitle.trim() } : t));
    setEditingTaskId(null);
  };

  const handleAddQuickTask = (e) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;
    const todayIST = getISTDateString();
    const newTask = {
      id: 'task-' + Date.now(),
      title: quickTaskText.trim(),
      subjectId: activeSubject || (subjects.length > 0 ? subjects[0].id : null),
      completed: false,
      priority: 'medium',
      dueDate: todayIST,
      createdAt: todayIST
    };
    setTasks(prev => [newTask, ...prev]);
    setQuickTaskText('');
  };

  // Filter tasks for today (either dueDate is todayIST or explicitly 'Today' or no date)
  const todayIST = getISTDateString();
  const todayTasks = tasks.filter(t => !t.dueDate || t.dueDate === todayIST || t.dueDate === 'Today');

  // Study hours calculations (strictly genuine sessions)
  const todaySessions = sessions.filter(s => s.date === todayIST);
  const totalMinutesStudiedToday = todaySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const hoursToday = (totalMinutesStudiedToday / 60).toFixed(1);
  const dailyGoalHours = settings?.dailyTargetHours || 4;

  // Streak calculation from real qualifying days
  const { currentStreak, longestStreak } = calculateStreaks(sessions, settings?.streakMinHours || 1);

  // Generate 7-day genuine activity chart data
  const chartDays = [];
  let totalSevenDayHours = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getISTDateString(d);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayMinutes = sessions
      .filter(s => s.date === dateStr)
      .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
    const dayHours = parseFloat((dayMinutes / 60).toFixed(1));
    totalSevenDayHours += dayHours;
    chartDays.push({ day: dayLabel, date: dateStr, hours: dayHours });
  }
  const avgSevenDayHours = (totalSevenDayHours / 7).toFixed(1);

  // Nearest upcoming genuine assignment
  const pendingAssignments = (assignments || [])
    .filter(a => a.status === 'pending' && a.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const nearestAssignment = pendingAssignments[0] || null;

  // Nearest upcoming genuine examination
  const upcomingExams = (exams || [])
    .filter(e => e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const nearestExam = upcomingExams[0] || null;

  // Coding Profile Connection Check
  const hasCodingProfile = Boolean(settings?.leetcodeHandle || settings?.codeforcesHandle);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Goal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 border border-indigo-500/20 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Daily Command Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Focus & Execution Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {sessions.length === 0 ? (
              <span>Start your first study session today. Target: <span className="text-indigo-400 font-semibold">{dailyGoalHours}h</span>.</span>
            ) : (
              <span>Logged <span className="text-indigo-400 font-semibold">{hoursToday}h</span> of {dailyGoalHours}h daily goal today.</span>
            )}
          </p>
        </div>

        {/* Real Streak Badge */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-orange-500/30 px-5 py-3 rounded-xl shadow-lg">
          <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400">
            <Flame className={`w-6 h-6 ${currentStreak > 0 ? 'animate-pulse text-orange-400' : 'text-slate-500'}`} />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Study Streak</div>
            <div className="text-xl font-bold text-white flex items-baseline gap-1">
              {currentStreak} <span className="text-xs text-orange-400 font-semibold">{currentStreak === 1 ? 'Day active' : 'Days active'}</span>
            </div>
            {longestStreak > 0 && (
              <div className="text-[10px] text-slate-500">Longest: {longestStreak}d</div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Timer + Daily Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Focused Study Timer */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Active Focus Timer
              </h2>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {timerType === 'pomodoro' ? `POMODORO (${pomodoroMode.toUpperCase()})` : 'CUSTOM DURATION'}
              </span>
            </div>

            {/* Mode selection tabs */}
            <div className="space-y-2 mb-6">
              <div className="flex rounded-xl bg-slate-900/90 p-1 border border-white/5">
                <button
                  onClick={() => switchPomodoro('focus', 25)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    timerType === 'pomodoro' && pomodoroMode === 'focus' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Focus (25m)
                </button>
                <button
                  onClick={() => switchPomodoro('shortBreak', 5)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    timerType === 'pomodoro' && pomodoroMode === 'shortBreak' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Break (5m)
                </button>
                <button
                  onClick={() => switchPomodoro('longBreak', 15)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    timerType === 'pomodoro' && pomodoroMode === 'longBreak' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Long (15m)
                </button>
              </div>

              {/* Custom presets row */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 mr-1">Custom:</span>
                {[30, 45, 60, 90].map(mins => (
                  <button
                    key={mins}
                    onClick={() => applyCustomDuration(0, mins)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      timerType === 'custom' && customMinutes === mins && customHours === 0
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Huge Digital Clock Display */}
            <div className="text-center py-5">
              <div className="font-mono text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-[0_0_25px_rgba(99,102,241,0.35)]">
                {formatTime(secondsLeft)}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Session Subject: <span className="text-indigo-400 font-medium">
                  {subjects.find(s => s.id === activeSubject)?.name || 'General Focus (Unassigned)'}
                </span>
              </p>
            </div>

            {/* Subject Selector for Session (clean empty handling) */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Tag Subject for this session:</label>
              {subjects.length === 0 ? (
                <div className="text-xs text-slate-500 bg-slate-900/60 border border-white/5 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                  <span>No subjects added yet. Add subjects in Academics.</span>
                  <button
                    onClick={() => onNavigate('academics')}
                    className="text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Go <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <select
                  value={activeSubject}
                  onChange={(e) => setActiveSubject(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">No Subject (General Study)</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} {s.code ? `(${s.code})` : ''}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-2 pt-2">
            {!isRunning ? (
              <button
                onClick={handleStartResume}
                className="flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Study</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handlePause}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20 active:scale-95 transition-all"
                >
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={handleStopAndSave}
                  title="Stop and record genuine elapsed time"
                  className="py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all active:scale-95 text-xs"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop & Save</span>
                </button>
              </>
            )}

            <button
              onClick={handleResetTimer}
              title="Reset timer"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Today's Tasks & Urgent Deadlines */}
        <div className="lg:col-span-7 space-y-6">
          {/* Daily To-Dos Card */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Today's Priorities</h2>
                <p className="text-xs text-slate-400">Mark off actions as you complete them</p>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-white/5">
                {todayTasks.filter(t => t.completed).length}/{todayTasks.length} Completed
              </span>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddQuickTask} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a new task for today..."
                value={quickTaskText}
                onChange={(e) => setQuickTaskText(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Task Items List */}
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {todayTasks.length === 0 ? (
                <div className="text-center py-10 rounded-xl border border-dashed border-white/10 bg-slate-900/30 text-slate-400 text-sm">
                  No tasks for today. Add your first task.
                </div>
              ) : (
                todayTasks.map(task => {
                  const sub = subjects.find(s => s.id === task.subjectId);
                  const isEditing = editingTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        task.completed 
                          ? 'bg-slate-900/40 border-white/5 opacity-60' 
                          : 'bg-slate-900/70 border-white/10 hover:border-indigo-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors flex-shrink-0 ${
                            task.completed 
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                              : 'border-white/20 hover:border-indigo-400'
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              value={editingTaskTitle}
                              onChange={(e) => setEditingTaskTitle(e.target.value)}
                              className="flex-1 bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-xs text-white"
                              autoFocus
                            />
                            <button
                              onClick={() => saveEditTask(task.id)}
                              className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingTaskId(null)}
                              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span 
                            onClick={() => toggleTask(task.id)}
                            className={`text-sm truncate cursor-pointer ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}
                          >
                            {task.title}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {sub && (
                          <span 
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: `${sub.color || '#6366F1'}20`, color: sub.color || '#6366F1' }}
                          >
                            {sub.code || sub.name}
                          </span>
                        )}

                        {!isEditing && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditTask(task)}
                              title="Edit task"
                              className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              title="Delete task"
                              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Overview Row: Deadlines & Next Exam */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onNavigate('academics')}
              className="glass-card p-4 rounded-xl cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Upcoming Assignment
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              {nearestAssignment ? (
                <>
                  <div className="font-semibold text-sm text-slate-200 truncate">
                    {nearestAssignment.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Due: <span className="text-amber-400 font-medium">{nearestAssignment.dueDate}</span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-500 py-2">
                  No upcoming assignments. Add in Academics.
                </div>
              )}
            </div>

            <div 
              onClick={() => onNavigate('academics')}
              className="glass-card p-4 rounded-xl cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                  <BookOpen className="w-3.5 h-3.5" /> Next Examination
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              {nearestExam ? (
                <>
                  <div className="font-semibold text-sm text-slate-200 truncate">
                    {nearestExam.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Target Date: <span className="text-rose-400 font-medium">{nearestExam.date}</span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-500 py-2">
                  No upcoming examinations recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Consistency Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Hours Area Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Study Activity (Last 7 Days)</h2>
              <p className="text-xs text-slate-400">Total genuine hours recorded (IST)</p>
            </div>
            {sessions.length > 0 && (
              <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Avg: {avgSevenDayHours} hrs/day
              </div>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="h-56 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl bg-slate-900/30">
              <Clock className="w-8 h-8 text-slate-500 mb-2 stroke-[1.5]" />
              <p className="text-sm text-slate-300 font-medium">No recorded study sessions yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Complete or log a study session using the timer to start tracking your daily progress and consistency charts.
              </p>
            </div>
          ) : (
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} unit="h" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', fontSize: '12px' }} 
                    itemStyle={{ color: '#818CF8' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#hourGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Coding Quick Summary Card (Clean profile check) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-semibold text-white">Coding Progress</h2>
              </div>
              <button 
                onClick={() => onNavigate('coding')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-0.5"
              >
                View <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">LeetCode & Codeforces sync overview</p>

            {!hasCodingProfile ? (
              <div className="p-4 rounded-xl border border-dashed border-white/10 bg-slate-900/40 text-center space-y-2">
                <Code2 className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-300 font-medium">No coding profiles connected</p>
                <p className="text-[11px] text-slate-500">
                  Connect your coding profiles in Coding to view your progress.
                </p>
                <button
                  onClick={() => onNavigate('coding')}
                  className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                >
                  Configure Profiles <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {settings.leetcodeHandle && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">LeetCode</div>
                      <div className="text-sm font-bold text-white font-mono">@{settings.leetcodeHandle}</div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                      Connected
                    </span>
                  </div>
                )}

                {settings.codeforcesHandle && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Codeforces</div>
                      <div className="text-sm font-bold text-white font-mono">@{settings.codeforcesHandle}</div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                      Connected
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 text-xs text-slate-400">
            {hasCodingProfile ? (
              <span>Profile sync active. Check Coding section for detailed statistics.</span>
            ) : (
              <span>Visit Coding section to set handles & contest radars.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
