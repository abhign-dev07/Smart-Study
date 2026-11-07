# AGENTS.md — Study Command Centre

## Core Agent Operating Rules & Directives

### 1. Stuck Protocol & Memory Lookup (Mandatory Hierarchy)
Whenever stuck, uncertain, or facing an issue—even for a single second:
1. **Consult `agents.md` First:** Review all operational guidelines, architectural rules, tech stack decisions, and design constraints.
2. **Perform RCA (Root Cause Analysis):**
   - Deeply inspect the bug or error trace.
   - Trace inputs, component hierarchy, storage state, and lifecycles.
   - Formulate a clear hypothesis and attempt resolution.
3. **Never Assume — Ask Clarifications:** If there is even the smallest doubt, ambiguity, or chance something is misunderstood:
   - **Do not assume anything.**
   - Ask the user directly with concise, specific questions. You are encouraged to ask as many questions as needed without hesitation.

### 2. Interaction Loop & Timeline Accountability
- Every user prompt and instruction must be recorded in [`timeline.md`](file:///c:/Users/Mr.%20Abhign/OneDrive/Desktop/Study%20Smart/timeline.md) along with the exact local timestamp (IST, UTC+05:30).
- Any issue or bug encountered during the instruction flow must be recorded with its Root Cause Analysis (RCA), resolution steps, and preventative measures for future sessions.
- If an instruction executed without flaws or bugs, mark it as **"Perfect"**.
- **Post-Prompt Confirmation Prompt:** At the conclusion of every response/turn, explicitly ask the user:
  > **"New instruction: Yes or No?"**
  - If **Yes**: A new instruction milestone will be initiated and recorded in [`timeline.md`](file:///c:/Users/Mr.%20Abhign/OneDrive/Desktop/Study%20Smart/timeline.md).
  - If **No**: Continue in the current timeline context. This indicates that adjustments/fixes are needed, what was delivered did not meet user expectations, and it will be logged as a failure/rework in [`timeline.md`](file:///c:/Users/Mr.%20Abhign/OneDrive/Desktop/Study%20Smart/timeline.md) to diagnose and eliminate recurring mistakes.

---

## Technical Architecture & Memory

### Core Stack
- **Framework:** React 18+ (Vite)
- **Language:** JavaScript (JSX)
- **Styling:** Tailwind CSS + Vanilla CSS Design Tokens (defined in [`design.md`](file:///c:/Users/Mr.%20Abhign/OneDrive/Desktop/Study%20Smart/design.md))
- **Icons:** Lucide React (`lucide-react`)
- **Charts:** Recharts
- **State & Local Persistence:** Browser `localStorage` (Local-first, no external DB/auth)
- **Date Handling & Timezone:** Indian Standard Time (IST, UTC+05:30)

### Primary Structure & Navigation (Strictly 3 Main Views)
1. **Dashboard:** Today's tasks, study target, upcoming deadlines, prominent "Start Study" timer trigger, coding stats overview, study hour & streak heatmaps.
2. **Academics:** Subject management, assignment tracker, daily to-do checklist, exam schedules/countdowns, syllabus topic tracking.
3. **Coding:** LeetCode & Codeforces progress, contest calendar/countdown, goal tracking, stats refresh.
- **Secondary Settings:** Accessed via a slide-over modal or header control (not a 4th main nav tab). Manages usernames, theme, streaks, backup/restore.

### Key Data Models & Storage Keys
- `scc_user_settings`: handles, streak threshold, theme, daily targets.
- `scc_tasks`: daily to-dos, subject tags, completion status.
- `scc_subjects`: subject name, color code, syllabus topics.
- `scc_assignments`: title, subject, due date, status (pending/completed).
- `scc_exams`: exam name, subject, target date, preparation checklist.
- `scc_study_sessions`: session timestamps, subject, duration, mode (pomodoro/stopwatch).
- `scc_coding_stats`: cached LeetCode/Codeforces statistics, manual goals, contest cache.
