// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: 'scc_user_settings_v2',
  TASKS: 'scc_tasks_v2',
  SUBJECTS: 'scc_subjects_v2',
  ASSIGNMENTS: 'scc_assignments_v2',
  EXAMS: 'scc_exams_v2',
  STUDY_SESSIONS: 'scc_study_sessions_v2',
  CODING_STATS: 'scc_coding_stats_v2',
  CONTESTS: 'scc_contests_v2',
  CP31_PROGRESS: 'scc_cp31_progress_v1',
  CONTEST_CALENDAR: 'scc_contest_calendar_v1',
  CP_SHEET_PROGRESS: 'scc_cp_sheet_progress_v1',
  DSA_SHEET: 'scc_dsa_sheet_progress_v1',
};

// Initial default settings (clean - no prefilled usernames)
export const DEFAULT_SETTINGS = {
  userName: '',
  dailyTargetHours: 4,
  streakMinHours: 1,
  theme: 'dark',
  leetcodeHandle: '',
  codeforcesHandle: '',
  pomodoroWork: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
};

// Clean empty lists for fresh installations
export const DEFAULT_SUBJECTS = [];
export const DEFAULT_TASKS = [];
export const DEFAULT_ASSIGNMENTS = [];
export const DEFAULT_EXAMS = [];
export const DEFAULT_SESSIONS = [];

// Known sample identifiers from v1 seed data to strip during migration
const DEMO_SUBJECT_IDS = new Set(['sub-1', 'sub-2', 'sub-3', 'sub-4', 'sub-5']);
const DEMO_TASK_IDS = new Set(['task-1', 'task-2', 'task-3', 'task-4']);
const DEMO_ASSIGNMENT_IDS = new Set(['asg-1', 'asg-2', 'asg-3']);
const DEMO_EXAM_IDS = new Set(['exam-1', 'exam-2']);
const DEMO_SESSION_IDS = new Set(['ses-1', 'ses-2', 'ses-3', 'ses-4', 'ses-5', 'ses-6', 'ses-7']);

/**
 * Migration helper that safely clears legacy v1 demo artifacts
 * without erasing genuine user records.
 */
function runStorageMigration() {
  try {
    // 1. Settings migration
    const legacySettings = localStorage.getItem('scc_user_settings');
    const v2Settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!v2Settings && legacySettings) {
      const parsed = JSON.parse(legacySettings);
      // Remove demo usernames if they match seed defaults
      if (parsed.leetcodeHandle === 'abhign') parsed.leetcodeHandle = '';
      if (parsed.codeforcesHandle === 'tourist') parsed.codeforcesHandle = '';
      if (parsed.userName === 'Student') parsed.userName = '';
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
    }

    // 2. Subjects migration (filter out hardcoded sub-1 through sub-5)
    const legacySubjects = localStorage.getItem('scc_subjects');
    const v2Subjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!v2Subjects && legacySubjects) {
      const parsed = JSON.parse(legacySubjects);
      const filtered = Array.isArray(parsed) 
        ? parsed.filter(s => !DEMO_SUBJECT_IDS.has(s.id)) 
        : [];
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(filtered));
    }

    // 3. Tasks migration (filter out task-1 through task-4)
    const legacyTasks = localStorage.getItem('scc_tasks');
    const v2Tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!v2Tasks && legacyTasks) {
      const parsed = JSON.parse(legacyTasks);
      const filtered = Array.isArray(parsed) 
        ? parsed.filter(t => !DEMO_TASK_IDS.has(t.id)) 
        : [];
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
    }

    // 4. Assignments migration (filter out asg-1 through asg-3)
    const legacyAssignments = localStorage.getItem('scc_assignments');
    const v2Assignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (!v2Assignments && legacyAssignments) {
      const parsed = JSON.parse(legacyAssignments);
      const filtered = Array.isArray(parsed) 
        ? parsed.filter(a => !DEMO_ASSIGNMENT_IDS.has(a.id)) 
        : [];
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(filtered));
    }

    // 5. Exams migration (filter out exam-1 through exam-2)
    const legacyExams = localStorage.getItem('scc_exams');
    const v2Exams = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (!v2Exams && legacyExams) {
      const parsed = JSON.parse(legacyExams);
      const filtered = Array.isArray(parsed) 
        ? parsed.filter(e => !DEMO_EXAM_IDS.has(e.id)) 
        : [];
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(filtered));
    }

    // 6. Study Sessions migration (filter out ses-1 through ses-7)
    const legacySessions = localStorage.getItem('scc_study_sessions');
    const v2Sessions = localStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
    if (!v2Sessions && legacySessions) {
      const parsed = JSON.parse(legacySessions);
      const filtered = Array.isArray(parsed) 
        ? parsed.filter(s => !DEMO_SESSION_IDS.has(s.id)) 
        : [];
      localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(filtered));
    }
  } catch (err) {
    console.error('Migration error:', err);
  }
}

// Run migration immediately
runStorageMigration();

// Helper to get or seed localStorage
export function getStoredData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${key}:`, err);
    return fallback;
  }
}

export function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
  }
}

// Format IST Date YYYY-MM-DD
export function getISTDateString(d = new Date()) {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(d.getTime() + (d.getTimezoneOffset() * 60000) + istOffset);
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate streaks based on IST dates and qualifying hours
export function calculateStreaks(sessions = [], streakMinHours = 1) {
  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Aggregate minutes by date
  const minutesByDate = {};
  sessions.forEach(s => {
    if (!s.date || !s.durationMinutes) return;
    minutesByDate[s.date] = (minutesByDate[s.date] || 0) + s.durationMinutes;
  });

  const qualifyingDates = new Set(
    Object.keys(minutesByDate).filter(date => (minutesByDate[date] / 60) >= streakMinHours)
  );

  if (qualifyingDates.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sorted unique qualifying dates ascending
  const sortedDates = Array.from(qualifyingDates).sort();

  let maxStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of sortedDates) {
    const curr = new Date(dateStr + 'T00:00:00');
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((curr - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > maxStreak) maxStreak = tempStreak;
    prevDate = curr;
  }

  // Check current streak relative to today/yesterday in IST
  const todayStr = getISTDateString();
  const today = new Date(todayStr + 'T00:00:00');
  const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
  const yesterdayStr = getISTDateString(yesterday);

  let currentStreak = 0;
  let checkDate = qualifyingDates.has(todayStr) ? today : (qualifyingDates.has(yesterdayStr) ? yesterday : null);

  if (checkDate) {
    while (true) {
      const dStr = getISTDateString(checkDate);
      if (qualifyingDates.has(dStr)) {
        currentStreak += 1;
        checkDate = new Date(checkDate.getTime() - (24 * 60 * 60 * 1000));
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak: Math.max(maxStreak, currentStreak) };
}
