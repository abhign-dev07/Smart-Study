import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, Clock, Trash2, CheckCircle2, 
  Pencil, X, Check, AlertCircle, Sparkles, BookOpen, Timer 
} from 'lucide-react';
import { getISTDateString } from '../../utils/mockData';

export default function AcademicsView({ 
  subjects, setSubjects, 
  assignments, setAssignments, 
  exams, setExams 
}) {
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'exams' | 'subjects'

  // Assignment Modal & Form State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubjectId, setAsgSubjectId] = useState('');
  const [asgDueDate, setAsgDueDate] = useState('');
  const [asgPriority, setAsgPriority] = useState('medium'); // 'low' | 'medium' | 'high'
  const [asgStatus, setAsgStatus] = useState('pending'); // 'pending' | 'completed'
  const [asgError, setAsgError] = useState('');

  // Exam Modal & Form State
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [examName, setExamName] = useState('');
  const [examSubjectId, setExamSubjectId] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examNotes, setExamNotes] = useState('');
  const [examError, setExamError] = useState('');

  // Subject Modal & Form State
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubColor, setNewSubColor] = useState('#6366F1');
  const [newSubHours, setNewSubHours] = useState(8);

  // Live Exam Countdown State
  const [nowTime, setNowTime] = useState(Date.now());

  // Ticking interval for live countdown and automatic cleanup of passed exams
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setNowTime(now);

      // Check if any exam scheduled time has passed
      setExams(prevExams => {
        let hasPassed = false;
        const validExams = prevExams.filter(exam => {
          if (!exam.date || !exam.time) return true;
          // Parse exam timestamp in IST context
          const examEpoch = new Date(`${exam.date}T${exam.time}:00+05:30`).getTime();
          if (isNaN(examEpoch)) return true;
          if (examEpoch <= now) {
            hasPassed = true;
            return false; // automatically remove expired exam
          }
          return true;
        });
        return hasPassed ? validExams : prevExams;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setExams]);

  // Compute nearest upcoming exam (strictly future)
  const sortedUpcomingExams = (exams || [])
    .map(exam => {
      const examEpoch = new Date(`${exam.date}T${exam.time || '00:00'}:00+05:30`).getTime();
      return { ...exam, epoch: isNaN(examEpoch) ? 0 : examEpoch };
    })
    .filter(exam => exam.epoch > nowTime)
    .sort((a, b) => a.epoch - b.epoch);

  const nearestExam = sortedUpcomingExams[0] || null;

  // Calculate countdown components
  let countdownDisplay = null;
  if (nearestExam) {
    const diffMs = nearestExam.epoch - nowTime;
    if (diffMs > 0) {
      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      countdownDisplay = { days, hours, minutes, seconds };
    }
  }

  // --- Assignment Handlers ---
  const openNewAssignmentModal = () => {
    setEditingAssignmentId(null);
    setAsgTitle('');
    setAsgSubjectId(subjects.length > 0 ? subjects[0].id : '');
    setAsgDueDate(getISTDateString());
    setAsgPriority('medium');
    setAsgStatus('pending');
    setAsgError('');
    setIsAssignmentModalOpen(true);
  };

  const openEditAssignmentModal = (asg) => {
    setEditingAssignmentId(asg.id);
    setAsgTitle(asg.title || '');
    setAsgSubjectId(asg.subjectId || '');
    setAsgDueDate(asg.dueDate || getISTDateString());
    setAsgPriority(asg.priority || 'medium');
    setAsgStatus(asg.status || 'pending');
    setAsgError('');
    setIsAssignmentModalOpen(true);
  };

  const handleSaveAssignment = (e) => {
    e.preventDefault();
    if (!asgTitle.trim()) {
      setAsgError('Assignment title is required.');
      return;
    }
    if (!asgDueDate) {
      setAsgError('Due date is required.');
      return;
    }

    if (editingAssignmentId) {
      setAssignments(prev => prev.map(a => {
        if (a.id === editingAssignmentId) {
          return {
            ...a,
            title: asgTitle.trim(),
            subjectId: asgSubjectId || null,
            dueDate: asgDueDate,
            priority: asgPriority,
            status: asgStatus
          };
        }
        return a;
      }));
    } else {
      const newAsg = {
        id: 'asg-' + Date.now(),
        title: asgTitle.trim(),
        subjectId: asgSubjectId || null,
        dueDate: asgDueDate,
        priority: asgPriority,
        status: asgStatus,
        createdAt: getISTDateString()
      };
      setAssignments(prev => [newAsg, ...prev]);
    }

    setIsAssignmentModalOpen(false);
  };

  const toggleAssignmentStatus = (id) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === 'completed' ? 'pending' : 'completed' };
      }
      return a;
    }));
  };

  const deleteAssignment = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  // --- Exam Handlers ---
  const openNewExamModal = () => {
    setEditingExamId(null);
    setExamName('');
    setExamSubjectId(subjects.length > 0 ? subjects[0].id : '');
    // Default date to tomorrow in IST
    const tomorrow = new Date(Date.now() + 86400000);
    setExamDate(getISTDateString(tomorrow));
    setExamTime('10:00');
    setExamNotes('');
    setExamError('');
    setIsExamModalOpen(true);
  };

  const openEditExamModal = (exam) => {
    setEditingExamId(exam.id);
    setExamName(exam.name || '');
    setExamSubjectId(exam.subjectId || '');
    setExamDate(exam.date || '');
    setExamTime(exam.time || '10:00');
    setExamNotes(exam.notes || '');
    setExamError('');
    setIsExamModalOpen(true);
  };

  const handleSaveExam = (e) => {
    e.preventDefault();
    if (!examName.trim()) {
      setExamError('Exam name is required.');
      return;
    }
    if (!examDate) {
      setExamError('Exam date is required.');
      return;
    }
    if (!examTime) {
      setExamError('Exam start time is required.');
      return;
    }

    // Validate that date & time are strictly in the future (IST context)
    const examEpoch = new Date(`${examDate}T${examTime}:00+05:30`).getTime();
    if (isNaN(examEpoch)) {
      setExamError('Invalid date or time format.');
      return;
    }
    if (examEpoch <= Date.now()) {
      setExamError('Exam scheduled date and time must be in the future.');
      return;
    }

    if (editingExamId) {
      setExams(prev => prev.map(ex => {
        if (ex.id === editingExamId) {
          return {
            ...ex,
            name: examName.trim(),
            subjectId: examSubjectId || null,
            date: examDate,
            time: examTime,
            notes: examNotes.trim()
          };
        }
        return ex;
      }));
    } else {
      const newExam = {
        id: 'exam-' + Date.now(),
        name: examName.trim(),
        subjectId: examSubjectId || null,
        date: examDate,
        time: examTime,
        notes: examNotes.trim(),
        syllabusTopics: [],
        completedTopics: []
      };
      setExams(prev => [newExam, ...prev]);
    }

    setIsExamModalOpen(false);
  };

  const deleteExam = (id) => {
    setExams(prev => prev.filter(ex => ex.id !== id));
  };

  // --- Subject Creation Handlers ---
  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const newSubject = {
      id: 'sub-' + Date.now(),
      name: newSubName.trim(),
      code: newSubCode.trim() || newSubName.substring(0, 3).toUpperCase(),
      color: newSubColor,
      targetHoursWeek: Number(newSubHours) || 8
    };
    setSubjects(prev => [...prev, newSubject]);
    setNewSubName('');
    setNewSubCode('');
    setShowAddSubject(false);
  };

  const pendingAssignments = (assignments || []).filter(a => a.status === 'pending');
  const completedAssignments = (assignments || []).filter(a => a.status === 'completed');

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Academics Hub</h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize coursework, track assignments, and prepare for examinations.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'assignments' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Assignments ({pendingAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'exams' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Exams ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'subjects' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Subjects ({subjects.length})
          </button>
        </div>
      </div>

      {/* Live Exam Countdown Banner (Rendered ONLY when an upcoming exam exists) */}
      {nearestExam && countdownDisplay && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900/70 border border-rose-500/30 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex-shrink-0">
              <Timer className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Next Upcoming Exam</span>
                {nearestExam.subjectId && subjects.find(s => s.id === nearestExam.subjectId) && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    {subjects.find(s => s.id === nearestExam.subjectId)?.name}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {nearestExam.name}
              </h2>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{nearestExam.date} at {nearestExam.time} IST</span>
              </div>
            </div>
          </div>

          {/* Countdown Clock Units */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-center min-w-[54px]">
              <div className="font-mono text-xl sm:text-2xl font-bold text-white">{countdownDisplay.days}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Days</div>
            </div>
            <span className="text-slate-500 font-bold text-xl">:</span>
            <div className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-center min-w-[54px]">
              <div className="font-mono text-xl sm:text-2xl font-bold text-white">
                {String(countdownDisplay.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Hours</div>
            </div>
            <span className="text-slate-500 font-bold text-xl">:</span>
            <div className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-center min-w-[54px]">
              <div className="font-mono text-xl sm:text-2xl font-bold text-white">
                {String(countdownDisplay.minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Mins</div>
            </div>
            <span className="text-slate-500 font-bold text-xl">:</span>
            <div className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-center min-w-[54px]">
              <div className="font-mono text-xl sm:text-2xl font-bold text-rose-400">
                {String(countdownDisplay.seconds).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Secs</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Pending Assignments</h2>
              <p className="text-xs text-slate-400">Track deadlines, submissions, and tasks</p>
            </div>
            <button
              onClick={openNewAssignmentModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          </div>

          {/* Pending items list */}
          <div className="space-y-3">
            {pendingAssignments.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-slate-900/30 text-slate-400 text-sm space-y-2">
                <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="font-medium text-slate-300">No pending assignments</p>
                <p className="text-xs text-slate-500">You are all caught up! Click "+ New Assignment" to add coursework.</p>
              </div>
            ) : (
              pendingAssignments.map(asg => {
                const sub = subjects.find(s => s.id === asg.subjectId);
                const priorityBadge = {
                  high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  low: 'bg-slate-500/10 text-slate-300 border-white/10'
                }[asg.priority || 'medium'];

                return (
                  <div key={asg.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleAssignmentStatus(asg.id)}
                        title="Mark as completed"
                        className="w-5 h-5 rounded-md border border-white/20 hover:border-indigo-400 flex items-center justify-center transition-colors flex-shrink-0"
                      >
                        {asg.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-white truncate">{asg.title}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {sub ? (
                            <span 
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                            >
                              {sub.name}
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                              General Coursework
                            </span>
                          )}
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> Due: {asg.dueDate}
                          </span>
                          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${priorityBadge}`}>
                            {asg.priority || 'medium'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openEditAssignmentModal(asg)}
                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                        title="Edit assignment"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAssignment(asg.id)}
                        className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Completed Assignments Section */}
          {completedAssignments.length > 0 && (
            <div className="pt-6 border-t border-white/5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Completed ({completedAssignments.length})
              </h3>
              {completedAssignments.map(asg => (
                <div key={asg.id} className="glass-card p-3 rounded-xl flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAssignmentStatus(asg.id)}
                      className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm line-through text-slate-400">{asg.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditAssignmentModal(asg)}
                      className="text-slate-400 hover:text-white p-1.5 rounded"
                      title="Edit assignment"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAssignment(asg.id)}
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Exams & Live Schedule */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Upcoming Examinations</h2>
              <p className="text-xs text-slate-400">Scheduled test dates, times, and countdowns</p>
            </div>
            <button
              onClick={openNewExamModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exam</span>
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-slate-900/30 text-slate-400 text-sm space-y-2">
              <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="font-medium text-slate-300">No upcoming examinations recorded</p>
              <p className="text-xs text-slate-500">Click "+ Add Exam" above to schedule test dates and monitor live countdowns.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sortedUpcomingExams.map(exam => {
                const sub = subjects.find(s => s.id === exam.subjectId);
                return (
                  <div key={exam.id} className="glass-panel p-5 rounded-2xl space-y-4 border-white/10 relative">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          {sub ? (
                            <span 
                              className="text-xs font-semibold px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                            >
                              {sub.name} ({sub.code || 'SUB'})
                            </span>
                          ) : (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                              General Exam
                            </span>
                          )}
                          <span className="text-xs font-medium text-rose-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5" /> {exam.time} IST
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white">{exam.name}</h3>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Date: <span className="text-slate-200 font-semibold">{exam.date}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditExamModal(exam)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="Edit exam"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteExam(exam.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete exam"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {exam.notes && (
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Notes</div>
                        {exam.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Subjects */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Enrolled Subjects</h2>
              <p className="text-xs text-slate-400">Manage academic courses and weekly targets</p>
            </div>
            <button
              onClick={() => setShowAddSubject(!showAddSubject)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Subject</span>
            </button>
          </div>

          {showAddSubject && (
            <form onSubmit={handleCreateSubject} className="glass-panel p-5 rounded-2xl space-y-4 border-indigo-500/30">
              <h3 className="text-sm font-semibold text-white">Add New Subject</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Subject name (e.g. Operating Systems)..."
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 sm:col-span-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Course code (e.g. CS301)..."
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-400">Color:</label>
                  <input
                    type="color"
                    value={newSubColor}
                    onChange={(e) => setNewSubColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <label className="text-xs text-slate-400 ml-2">Weekly Goal (Hours):</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={newSubHours}
                    onChange={(e) => setNewSubHours(e.target.value)}
                    className="w-16 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSubject(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg"
                  >
                    Save Subject
                  </button>
                </div>
              </div>
            </form>
          )}

          {subjects.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-slate-900/30 text-slate-400 text-sm space-y-2">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="font-medium text-slate-300">No subjects added yet</p>
              <p className="text-xs text-slate-500">Click "+ New Subject" to create coursework categories for assignments and timer tracking.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(s => (
                <div key={s.id} className="glass-panel p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-xs font-bold px-2.5 py-1 rounded-md"
                      style={{ backgroundColor: `${s.color}25`, color: s.color }}
                    >
                      {s.code}
                    </span>
                    <span className="text-xs text-slate-400">
                      Target: {s.targetHoursWeek}h / week
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-base">{s.name}</h3>
                  <div className="text-xs text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span>Active Course</span>
                    <button
                      onClick={() => setSubjects(prev => prev.filter(sub => sub.id !== s.id))}
                      className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- MODAL: Assignment Form (Modal Overlay) --- */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editingAssignmentId ? 'Edit Assignment' : 'New Assignment'}
              </h2>
              <button 
                onClick={() => setIsAssignmentModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {asgError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{asgError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assignment Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Socket Programming Lab Assignment"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  {subjects.length === 0 ? (
                    <div className="text-xs text-slate-400 bg-slate-900 border border-white/10 rounded-xl p-2.5">
                      No subjects added yet. Will save as general coursework.
                    </div>
                  ) : (
                    <select
                      value={asgSubjectId}
                      onChange={(e) => setAsgSubjectId(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">No Subject (General)</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Due Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={asgPriority}
                    onChange={(e) => setAsgPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={asgStatus}
                    onChange={(e) => setAsgStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAssignmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {editingAssignmentId ? 'Save Changes' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: Exam Form (Modal Overlay) --- */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editingExamId ? 'Edit Exam' : 'Schedule New Exam'}
              </h2>
              <button 
                onClick={() => setIsExamModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {examError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{examError}</span>
              </div>
            )}

            <form onSubmit={handleSaveExam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Exam Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operating Systems Mid-Semester Exam"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject (Optional)</label>
                {subjects.length === 0 ? (
                  <div className="text-xs text-slate-400 bg-slate-900 border border-white/10 rounded-xl p-2.5">
                    No subjects created yet. Can be scheduled without a subject.
                  </div>
                ) : (
                  <select
                    value={examSubjectId}
                    onChange={(e) => setExamSubjectId(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">No Subject (General)</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Exam Date (IST) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Time (IST) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Optional Notes / Syllabus Summary</label>
                <textarea
                  placeholder="e.g. Bring calculator. Covers Chapters 1 to 5: Processes, Memory, CPU Scheduling."
                  rows={2}
                  value={examNotes}
                  onChange={(e) => setExamNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {editingExamId ? 'Save Changes' : 'Schedule Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
