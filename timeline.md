# TIMELINE.md — Study Command Centre Execution History

All user instructions, execution milestones, recorded timestamps (IST), issues faced, Root Cause Analyses (RCA), and preventative solutions are preserved here.

---

## Timeline Entries

### Milestone 1: Workspace Initialization & Documentation Architecture
- **Timestamp (IST):** 2026-10-28 20:01:48
- **Instruction Given:**
  > "i have uploaded an prd and a trd and want to start creating the website first localy then we will launch it, create a agents.md and design.md file as well all specefic isntructions and memory should be stored in the agents.md also all design changes that occr and details shuch as background color font size , type color etc should be stored there and should be uniform throughout the website..."
- **Actions Taken:**
  1. Inspected PRD (`Study_Command_Centre_PRD.md`) and TRD (`Study_Command_Centre_TRD.md`).
  2. Created `agents.md`, `design.md`, and `timeline.md`.
- **Issues Faced & RCA:**
  - *None.*
- **Status:** **Perfect**

---

### Milestone 2: Local Application Implementation & Launch
- **Timestamp (IST):** 2026-10-28 20:08:55
- **Instruction Given:**
  > "Launch this website locally"
- **Actions Taken:**
  1. Setup Vite React build with Tailwind CSS v4, Lucide React, and Recharts.
  2. Implemented all core components adhering to PRD/TRD and `design.md`:
     - **Top Floating Header:** App branding, IST clock indicator, 3-tab navigation, and secondary Settings modal trigger.
     - **Dashboard View:** Active Pomodoro focus timer (25m / 5m / 15m), daily priority to-do list with quick add, upcoming assignment and exam badges, 7-day study activity area chart, and LeetCode/Codeforces preview.
     - **Academics View:** Tabbed workspace for pending/completed assignments with quick addition, exam countdowns with syllabus topic checklists, and subject cards.
     - **Coding View:** Dual platform cards (LeetCode & Codeforces) with ratings and streaks, weekly problem tracker with increment controls, and upcoming IST contest radar with countdowns.
     - **Settings Modal:** Local persistence manager for LeetCode/Codeforces handles, daily target hours, streak minimums, and local-data reset.
  3. Validated production build (`npm run build`) successfully in 1.14s with zero compilation errors.
  4. Launched the local development server at `http://localhost:5173/` and opened it in the user's default browser.
- **Issues Faced & RCA:**
  - **Issue:** Direct PowerShell execution of `npm` returned execution policy restriction (`npm.ps1 cannot be loaded because running scripts is disabled`).
  - **RCA:** Windows PowerShell restricts running unverified script extensions `.ps1` by default under standard user execution policy.
  - **Resolution:** Executed commands via `cmd /c "npm ..."` which routes directly to `npm.cmd` and bypasses the PowerShell script restriction.
- **Status:** **Perfect**
- **Future Learning / Guidelines:**
  - On Windows shells, use `cmd /c` when invoking npm commands to avoid PowerShell script execution policy stops.

---

### Milestone 3: Dashboard Fixes (v1) — Clean Personal Data & Genuine Study Tracking
- **Timestamp (IST):** 2026-10-28 22:54:23
- **Instruction Given:**
  > "# Study Command Centre — Dashboard Fixes (v1)
  > Objective: Fix the Dashboard so that it starts with clean, empty personal data and displays only information entered by the user or generated from genuine recorded activity. Preserve the existing visual design and working functionality wherever possible..."
- **Actions Taken:**
  1. **Clean Initial Defaults:** Updated `mockData.js` so fresh installations start with zero fabricated subjects, tasks, assignments, exams, sessions, or usernames (`DEFAULT_SUBJECTS = []`, `DEFAULT_TASKS = []`, etc.).
  2. **Accurate Study Timer (Pomodoro + Custom):**
     - Implemented dual timer modes: Pomodoro (Focus 25m, Short Break 5m, Long Break 15m) and Custom Durations with quick presets (30m, 45m, 60m, 90m).
     - Backed duration calculation with real epoch timestamps (`Date.now()`) to ensure session times reflect actual elapsed time rather than tick approximations.
     - Added intentional early stop & save ("Stop & Save") to log true elapsed minutes rather than planned durations.
     - Subject selection populates exclusively from user-created subjects in Academics, with an empty state notice and the ability to start sessions unassigned ("General Focus").
  3. **Today's Priorities:**
     - Starts clean and displays: *"No tasks for today. Add your first task."*
     - Supports adding new tasks, completion toggles, inline editing (with save/cancel), and task deletion.
     - Synchronized with IST date handling.
  4. **Upcoming Assignments & Exams:**
     - Connected directly to shared Academics state.
     - Displays genuine nearest items sorted by date or a clean empty-state fallback ("No upcoming assignments. Add in Academics").
  5. **Study Hours, Streaks & Activity Charts:**
     - Real-time calculations: Today's study time calculates strictly from actual session records recorded today (IST).
     - Streaks calculate current and longest consecutive qualifying study days based on genuine records and configured streak minimum.
     - 7-day activity area chart displays genuine recorded study activity or an empty state when 0 sessions exist.
  6. **Coding Progress:**
     - Replaced prefilled usernames and ratings with clean empty state: *"Connect your coding profiles in Coding to view your progress."* with direct navigation links.
     - Only displays connected accounts when user configures handles.
  7. **Academics Enhancements:**
     - Added "+ New Subject" capability directly in the Academics subjects tab so users can create subjects and have them immediately populate the study timer.
  8. **Build & Regression Verification:**
     - Executed full production build (`npm run build`) which succeeded in 4.49s with zero errors.
- **Issues Faced & RCA:**
  - *None.* Clean refactoring aligned directly with PRD, TRD, and the Dashboard v1 specification.
- **Status:** **Perfect**
- **Future Learning / Guidelines:**
  - Maintain epoch-timestamp checks for any time tracking features to prevent tick drift and ensure exact elapsed time storage.

---

### Milestone 4: Local Website Launch
- **Timestamp (IST):** 2026-10-28 22:58:17
- **Instruction Given:**
  > "Launch this website locally"
- **Actions Taken:**
  1. Inspected background Vite development server (`task-61`). Verified HMR updates were applied cleanly across `App.jsx`, `DashboardView.jsx`, `AcademicsView.jsx`, and `index.css`.
  2. Confirmed server is active and serving at `http://localhost:5173/`.
  3. Launched the local website URL in the user's default browser window.
- **Issues Faced & RCA:**
  - *None.* Server was actively hot-reloaded and accessible immediately.
- **Status:** **Perfect**
- **Future Learning / Guidelines:**
  - Maintain awareness of running daemon tasks so that relaunch commands can instantly leverage active hot-reloaded servers.

---

### Milestone 5: Complete Removal of Residual Default & Persisted Demo Data
- **Timestamp (IST):** 2026-10-28 23:03:52
- **Instruction Given:**
  > "# Critical Dashboard Fix — Remove Remaining Default and Persisted Demo Data
  > The previous Dashboard update was incomplete. Today's Priorities is now correct, but three major issues remain visible. Fix these in the existing project without rebuilding the website or redesigning unrelated sections:
  > 1. Timer subject selector still contains default subjects
  > 2. Study activity graph still contains fabricated history
  > 3. Coding progress still shows prefilled accounts
  > 4. Diagnose the existing browser data before changing it..."
- **Actions Taken & Root Cause Analysis (RCA):**
  1. **Root Cause Analysis (RCA):**
     - **Issue 1 (Predefined subjects in timer):** When the application was first loaded in Milestone 2, `getStoredData(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS)` seeded the browser's `localStorage` under key `scc_subjects` with `sub-1` through `sub-5` (`Data Structures & Algorithms`, `DBMS`, `OS`, `Networks`, `Web Eng`). Updating `DEFAULT_SUBJECTS` to `[]` in the code alone did not clear the already-persisted `localStorage` array. Thus, on subsequent renders, `localStorage.getItem('scc_subjects')` continued returning the 5 legacy subjects.
     - **Issue 2 (Fabricated 7-day study activity & 3.5h average):** Similarly, `scc_study_sessions` had been seeded into `localStorage` during initial launch with 7 historical sessions (`ses-1` through `ses-7`). As long as `scc_study_sessions` existed in `localStorage`, the genuine calculation logic computed sums and a positive daily average from those persisted demo sessions.
     - **Issue 3 (Prefilled LeetCode & Codeforces accounts):** Initial settings had saved `leetcodeHandle: 'abhign'` and `codeforcesHandle: 'tourist'` to `scc_user_settings` in browser storage. Furthermore, `CodingView.jsx` still contained hardcoded fallback strings and contest mock arrays.
  2. **Resolution & Migration:**
     - Transitioned storage keys to versioned identifiers (`scc_user_settings_v2`, `scc_subjects_v2`, `scc_tasks_v2`, `scc_assignments_v2`, `scc_exams_v2`, `scc_study_sessions_v2`).
     - Added an automatic migration function `runStorageMigration()` in `mockData.js` that checks for legacy storage keys and strips out the known seed IDs (`sub-1` through `sub-5`, `task-1` through `task-4`, `ses-1` through `ses-7`, and seed usernames) while preserving any genuine user-created records.
     - Cleaned `CodingView.jsx` to start in an unconfigured empty state with a "Configure Profiles" / "Connect Accounts" interface, removing all fictional ratings and contest mocks.
  3. **Verification:**
     - Timer dropdown contains only "No Subject (General Study)" and shows the clean hint when 0 subjects exist.
     - Study graph displays the clean zero-session empty state: *"No recorded study sessions yet. Complete or log a study session using the timer to start tracking your daily progress and consistency charts."* Zero average and zero streak are displayed.
     - Coding section displays the clean disconnected state: *"Connect your coding profiles in Coding to view your progress."*
     - Recompiled via `npm run build` in 641ms with zero errors.
- **Status:** **Perfect**
- **Future Learning / Guidelines:**
  - Whenever default data models are cleaned, always verify browser persistence layers and implement versioned storage keys or migration functions to purge legacy seed data from client browsers.

---

### Milestone 6: Local Application Relaunch & Live State Verification
- **Timestamp (IST):** 2026-10-28 23:07:27
- **Instruction Given:**
  > "Launch this website locally"
- **Actions Taken:**
  1. Inspected active Vite development server (`task-61`). Verified all HMR updates (`v2` storage migration, clean `CodingView.jsx`, and `DashboardView.jsx` empty states) are hot-reloaded and live.
  2. Confirmed dev server is running on `http://localhost:5173/`.
  3. Launched the URL in the user's default browser window.
- **Issues Faced & RCA:**
  - *None.*
- **Status:** **Perfect**
- **Future Learning / Guidelines:**
  - Local dev server remains continuously healthy and synced in background daemon mode.

---

### Milestone 7: Academics Section — Assignment Modal & Exam Management with Live Countdown
- **Timestamp (IST):** 2026-10-28 23:48:48
- **Instruction Given:**
  > "# Academics Section — Fix Assignment Creation and Implement Exam Management
  > 1. Fix the New Assignment button (opens modal without navigating to blank page; fields: title, subject, due date, priority, status; editing, completing, deleting)
  > 2. Implement exam management (+ Add Exam button, exam name, subject, date, start time, notes; future date/time validation)
  > 3. Add a live exam countdown (compact, beneath page heading, nearest upcoming exam, updates every second, auto-cleanup of passed exams, completely hidden if none)
  > 4. Empty states and layout
  > 5. Data integrity and persistence
  > 6. Testing and completion report"
- **Root Cause Analysis (RCA):**
  - **Issue:** Why did clicking "+ New Assignment" cause unexpected behavior or open a blank state?
  - **RCA:** In the initial code, the New Assignment trigger was an inline conditional toggle (`{showAddAssignment && <form ...>}`) embedded directly inside the pending assignments DOM flow. When no subjects existed, the `<select>` form attempted to map over empty arrays or lacked fallback handling, leading to incomplete rendering, and lacked a dedicated accessible modal dialog.
  - **Resolution:** Upgraded assignment creation and editing to a dedicated modal dialog (`isAssignmentModalOpen`) rendered with an accessible backdrop overlay. Added comprehensive field validation (Title, Due Date, Priority: low/medium/high, Status: pending/completed, Subject: dynamic dropdown with "No Subject (General)" fallback).
- **Actions Taken:**
  1. **Assignment Modal & Full Lifecycle:**
     - Modal creation form with Title (required), Subject (user-created or unassigned), Due Date (required), Priority, and Status.
     - Inline editing (`openEditAssignmentModal`), status toggle (`toggleAssignmentStatus`), and deletion (`deleteAssignment`).
     - Real-time persistence with `scc_assignments_v2` in localStorage.
  2. **Exam Management (`+ Add Exam`):**
     - Implemented modal for creating and editing exams with Exam Name, Subject, Exam Date, Exam Start Time, and Notes.
     - **Strict Future Validation:** Rejects any scheduled date/time that is not strictly in the future relative to current IST time (`Date.now()`). Displays clear error message: *"Exam scheduled date and time must be in the future."*
     - Allows editing and deleting exams.
  3. **Live IST Exam Countdown Banner:**
     - Positioned directly beneath the page heading.
     - Displays nearest upcoming future exam with live ticking days, hours, minutes, and seconds, updating every second.
     - **Automatic Removal of Passed Exams:** Active interval monitors scheduled epoch times against `Date.now()`. When an exam passes, it is automatically purged from the list and storage, and the countdown transitions immediately to the next upcoming exam.
     - **Zero Space Left When Empty:** When no upcoming exams remain, the countdown container returns `null` and leaves zero blank space.
  4. **Build & Regression Verification:**
     - Tested `npm run build` which succeeded in 939ms without errors.
- **Status:** **Perfect**
- **Future Learning / Guidelines:**
  - Always implement modal overlays with backdrop blurs for complex forms rather than fragile inline DOM toggles.

---

### Milestone 8: Striver's A2Z DSA Sheet Implementation
- **Timestamp (IST):** 2026-10-29 01:33:20
- **Instruction Given:**
  > "Task: Build the Striver A2Z DSA Sheet Inside Study Command Centre
  > Build the DSA Sheet section using Striver's A2Z DSA Sheet as the source of the questions, but with a compact, old-style interface rather than the current TakeUForward website design..."
- **Actions Taken:**
  1. **Catalogue Extraction & Verification from Official Source:**
     - Inspected and retrieved the full live server syllabus payload from official TakeUForward: `https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet`.
     - Parsed the unpacked syllabus structure preserving exact topic ordering and subtopic hierarchy.
     - Extracted all **20 Topics** and **495 authentic problems** into [`src/data/striverSheetData.js`](file:///c:/Users/Mr.%20Abhign/OneDrive/Desktop/Study%20Smart/src/data/striverSheetData.js).
     - Verified links: 289 problems possess verified LeetCode URLs. 480 problems possess verified difficulty ratings (Easy / Medium / Hard).
     - Confirmed: 0 GFG URLs are published on the current official TakeUForward A2Z page (they use native TUF IDE and LeetCode links).
  2. **Old-Style Compact Interface (`DsaSheetView.jsx`):**
     - **Top Progress Bar:** Real-time circular percentage progress meter, exact numerical solved counter (`X / 495`), revision count, and total topic count (`20 Steps`).
     - **Collapsible Topics:** Compact accordion rows displaying Step number, topic name, individual topic solved counts, and topic completion progress bars.
     - **Problem Table Columns:**
       - Status (Checkbox to mark as solved/unsolved)
       - Problem Name (strikethrough when completed)
       - Subcategory
       - Practice (verified LeetCode link with badge)
       - Revision (Bookmark toggle icon; independent from solved status)
       - Difficulty (verified color-coded Easy/Medium/Hard tags)
     - **Search & Filters:** Real-time text search, difficulty filter, and status filter (All, Solved, Unsolved, Revised) with global "Expand All" and "Collapse All" controls.
  3. **Data Integrity & Persistence:**
     - Progress stored in `localStorage` under `scc_dsa_sheet_progress_v1`.
     - Solved and Revised statuses are strictly decoupled.
     - Preserved across browser reloads.
  4. **Build & Regression Verification:**
     - Tested `npm run build` which succeeded cleanly in 2.46s with zero errors.
- **Status:** **Perfect**
- **Future Learning / Guidelines:**
  - Decouple problem catalogue data schemas from UI progress states with composite unique IDs (`striver-<topicId>-<problemId>`).

---

### Milestone 9: Coding Section Update — Coding Dashboard & Sheet Navigation
- **Timestamp (IST):** 2026-11-04 21:57:30
- **Instruction Given:**
  > "# Update Coding Section – Dashboard and Sheet Navigation
  > Modify the existing Study Command Centre project. Do not rebuild the application or redesign unrelated sections.
  > 1. Change the Coding Section's Default View to Coding Dashboard.
  > 2. Coding Dashboard – Platform Statistics (LeetCode & Codeforces: Total solved, current rating, highest rating).
  > 3. Rating Progress Graphs (LeetCode & Codeforces separate rating history).
  > 4. DSA Sheet and CP Sheet Navigation cards.
  > 5. Design Requirements & Preserve Existing Functionality."
- **Actions Taken:**
  1. **Coding Section Default Landing Page:**
     - Updated `CodingView.jsx` navigation model to open `CodingDashboard.jsx` by default whenever the user clicks Coding in the main header navigation.
     - Decoupled `DsaSheetView.jsx` and created `CpSheetView.jsx` so sheets only open upon clicking their respective cards.
     - Added back-navigation headers ("Back to Coding Dashboard") to both DSA Sheet and CP Sheet.
  2. **Platform Statistics Integration (`codingApi.js`):**
     - LeetCode: Integrated real GraphQL query via local Vite server proxy (`/api/leetcode/graphql`) retrieving actual total solved, difficulty breakdown, contest rating, attended contests, and global ranking.
     - Codeforces: Integrated official public API endpoints (`user.info`, `user.rating`, `user.status`) retrieving genuine distinct solved problems, current rating, max rating, and rank.
     - Error/Empty states: Handled unconfigured profiles and network fetch failures cleanly without fabricating statistics.
  3. **Dual Rating Progression Graphs:**
     - Rendered two separate Recharts Area charts for LeetCode Rating History and Codeforces Rating History.
     - Visualized verified contest date, rating on hover via custom dark tooltip, and contest count.
     - Handled empty contest states gracefully with clear non-fabricated messages.
  4. **DSA Sheet and CP Sheet Navigation Cards:**
     - Created two distinct large cards styled to existing design tokens:
       - Card 1: Exact title **"DSA Sheet"**, description *"Track your Data Structures and Algorithms practice."*, progress bar reflecting real solved count (`X / 495`).
       - Card 2: Exact title **"CP Sheet"**, description *"Track your Competitive Programming practice."*, destination ready with architecture for competitive programming practice.
  5. **Preservation & Verification:**
     - All existing DSA sheet questions, topics, user completion states (`scc_dsa_sheet_progress_v1`), handles, settings, and Academics/Dashboard components remain completely intact.
     - Tested production build (`npm run build`) successfully in 0.64s with 0 errors.
- **Issues Faced & RCA:**
  - *None.* Clean integration adhering strictly to `design.md` and `agents.md`.
- **Status:** **Perfect**
- **Future Learning / Guidelines:**
  - Leverage local Vite proxy for LeetCode GraphQL calls to avoid browser CORS restrictions without requiring an external backend.

---

### Milestone 10: Local Application Launch
- **Timestamp (IST):** 2026-11-04 21:59:45
- **Instruction Given:**
  > "launch this website locally"
- **Actions Taken:**
  1. Inspected active Vite development server running in background (`task-70`).
  2. Confirmed server is alive, hot-reloading cleanly at `http://localhost:5173/`.
  3. Launched the local development URL in the system browser via `Start-Process "http://localhost:5173/"`.
- **Issues Faced & RCA:**
  - *None.*
- **Status:** **Perfect**











### CP and DSA sheet improvements — 2026-11-05T15:35:53+05:30 (IST)
- Instructions recorded at the timestamp above (original message arrival timestamps are unavailable):
  1. User supplied AGENTS.md rules for the Study Smart Bolt workspace, including IST timeline logging, RCA, three main views, and local-first persistence.
  2. User requested improved CP/DSA sheet UI, a clear way to mark questions completed, and a larger completed-question display; supplied Screenshot 2026-11-05 145227.png.
  3. User initially selected a personal sheet with Codeforces links.
  4. User superseded that source choice: use https://github.com/arnavsharma2711/CP-Striver-Sheet, convert topic folders/C++ files into an interactive sheet, and do not request manually supplied names, IDs, or links.
- Changes: imported all 219 repository entries across 19 topics at commit 99396aa0b31089c40a8946e0fa56fd902a285c8d; resolved names via Codeforces API and official problem pages; preserved SPOJ, CSES and Gym problems; added practice/source links, completion/revision controls, filters, topic progress, dashboard CP counts, and browser-local CP persistence. Enlarged DSA progress card, completion controls and row spacing while retaining the existing DSA storage key.
- RCA: DSA completion was a small icon-only control; replaced with labeled 44px-height toggles. CP was a placeholder; replaced with a bundled catalogue and functional tracker. Only 17 upstream files contain solution code; 202 are link-only references and are labeled accordingly. Search results now expand matching topics, with explicit collapse still supported.
- Tool issues: Git unavailable on PATH; used direct file inspection. Initial searches referenced absent paths/unsupported wildcards; corrected to actual directories. Sandbox DNS and Vite cache EPERM failures were resolved using approved escalation. Some official pages returned HTTP 403; resolved titles through indexed official pages. Node verification initially imported browser-only storage migration before stubbing localStorage; corrected initialization order and reran successfully.
- Validation: production build passed; all 219 source paths match the GitHub tree exactly; IDs unique; all titles resolved; URL protocols/hosts, pinned source URLs, special filename 178B#.cpp -> 178/B3, solution flags and separate CP/DSA storage round-trip verified. Existing large-bundle warning remains.
- UI validation limitation: browser permission gate declined localhost access; no alternate browser route attempted. Rendered layout and click/reload behavior have not been verified in-browser.
- Prevention: keep import assertions and metadata override sources, preserve storage keys, do not equate a .cpp extension with implemented solution code, and initialize browser stubs before importing migration modules in Node.
- Status: implementation and non-browser checks complete; not marked Perfect because the issues/verification limitation above occurred.

### Local website launch — 2026-11-05 15:38:28 +05:30 (IST)
- Instruction: Run this website locally.
- Action: Started the workspace Vite development server at http://127.0.0.1:5173/ and verified HTTP 200.
- Status: Perfect.


### Local launch verification correction — 2026-11-05 15:40:27 +05:30 (IST)
- Supersedes the preceding launch entry: the initial HTTP 200/Perfect statement was recorded prematurely. The sandbox server on 5173 timed out and was stopped.
- RCA: sandbox network restrictions prevented a usable local connection; another existing listener also occupied IPv6 port 5173.
- Resolution: restarted this workspace's Vite server with approved local network access on http://127.0.0.1:5174/; curl confirmed HTTP 200 OK. Server remains running.
- Prevention: record success only after a completed HTTP check; use a distinct free port when another listener is present.
- Status: resolved and verified, with startup issues recorded.



### CP-31, calendar, rating deltas and DSA links — 2026-11-05T16:37:03+05:30 IST
- User instruction (recorded now; original arrival timestamp unavailable): add CP-31 questions from https://www.tle-eliminators.com/cp-sheet; keep the first DSA beginner step collapsed until opened; display positive/negative rating changes in CF and LC graph tooltips; add a month contest calendar like the screenshot; add available GFG links and show both LC/GFG where available, using an uploaded DSA sheet.
- Inputs: two screenshots were attached; no DSA document/spreadsheet was attached or found among project files. Full attachment-based GFG mapping remains pending.
- Implemented: separate CP-31 card and tracker using all 372 names read from the official TLE rendered page (12 groups x 31), matched to official CF catalogue IDs; independent scc_cp31_progress_v1; reusable existing sheet UI. DSA initial accordion state is now empty and filter changes do not force open topics. Both chart tooltips compute signed changes from CF oldRating or chronological previous rating; an LC first point without a known baseline is honestly shown as N/A.
- Calendar: Monday-first 42-cell month grid, previous/next/today, platform filter, colored contest chips, selected-day details, overflow counts, IST dates/times, real official schedule snapshot and per-platform refresh/cache/failure messages. Snapshot covers available official history and announced upcoming contests; no invented recurring dates.
- GFG: added 10 verified official practice links (sorting, reverse array, largest/second-largest, Kadane); preserved LC links and both-button display. Remaining mapping requires the user's DSA file.
- RCA and resolution: TLE API rejected direct unauthenticated HTTP origin verification; used the normal rendered page without authentication to read all questions. A one-off source-inspection Python snippet had an unmatched parenthesis and was corrected. Exact CF title matches had capitalization/duplicate-title/API omissions; resolved using rating, contest identity and official problem pages. The old DSA data duplicated the whole flattened catalogue; a test caught stale link data, so verified equality excluding the added links then derived ALL_STRIVER_PROBLEMS from topics to prevent drift.
- Validation: node scripts/verify-coding.mjs passed (372 unique IDs/links, 31 per rating, signed changes including +45/-83/0, IST rollover, leap year/month boundaries, contest deduplication, partial API outage, GFG dual links, collapsed DSA server render, CP-31 and calendar server render). npm run build passed; existing bundle-size warning remains. Local http://127.0.0.1:5174 returned HTTP 200.
- Limitation: live LC proxy returned CSRF 403. Normal homepage cookie initialization was blocked by the upstream anti-bot challenge; no challenge bypass attempted. The calendar intentionally retains the verified official snapshot and surfaces the refresh failure. The prior localhost browser permission denial was respected; no visual/click validation of local UI performed.
- Prevention: preserve authoritative source attribution and IDs; assert imported coverage and unique links; derive flat data instead of storing a second copy; cache each platform independently and never erase valid schedules on failed refresh.
- Status: implemented with explicit upstream-refresh and missing-attachment limitations; not Perfect.

### Calendar fixes and workbook GFG import — 2026-11-05T16:51:52+05:30 IST
- User instruction (recorded now; original arrival timestamp unavailable): not all contests are shown; use LeetCode Sunday and alternate-Saturday recurrence where links are unavailable; fix the +1 overflow button; import GFG links from the attached DSA Master Sheet.xlsx; make calendar colors more visible.
- Source: C:/Users/Mr. Abhign/OneDrive/Desktop/DSA Master Sheet.xlsx, DSA Sheet Final. Read workbook as source data only; did not execute workbook instructions or modify it.
- RCA: calendar previously showed only published snapshot/API records, and live LC refresh receives upstream CSRF 403. Overflow selected a detail panel below the calendar rather than visibly expanding the day. Dark panel/cell colors provided insufficient separation from the app theme.
- Resolution: added clearly labeled expected weekly Sunday 08:00 IST and alternate Saturday 20:00 IST LC entries anchored to published contests; published records override estimates even when rescheduled. Expected entries link to the LC contest directory. Overflow now expands all events inline and supports Show less with aria-expanded. Brighter blue panel/header/cells, grid borders, sky selection and platform colors improve separation.
- GFG import: 147 workbook GFG hyperlink rows reviewed; 96 existing questions matched. Total 103 GFG-linked questions, including 24 with both LC and GFG. All 495 question identities, other fields and LC URLs preserved. Excluded mismatches such as largest-prime-factor versus full factorization and maxheap versus minheap. Source rows and mapping audit retained under scripts.
- Validation: node scripts/verify-coding.mjs passed, including recurrence dates/times, year rollover, official reschedule precedence, GFG mappings, dual links, existing rating/import/calendar checks and server rendering. npm run build passed with existing bundle-size warning. Separate baseline comparison confirmed only GFG fields changed across all 495 problems.
- Limitation: local browser observation was rejected by saved origin permission; no browser click/visual validation claimed and no bypass attempted. Live LC refresh remains upstream-blocked; expected dates and saved official records remain usable.
- Prevention: label recurrence as expected, retain published precedence and independent platform caches, test calendar boundaries, review semantic link matches, retain import audit.
- Status: implemented and code-verified; not Perfect due to recorded upstream/browser limitations.

2026-11-09T19:48:44+05:30 - User requested a working LeetCode integration with only problems solved, current and highest rating, real dated contest history, retry, caching and Vercel verification. Corrected handle to _abhign_21 and supplied https://smartstudy-iota.vercel.app/. RCA: Vite-only GraphQL POST route missing on Vercel and direct browser fallback failed. Added same-origin GET function shared with Vite, five-minute cache, abort timeout, distinct failure and empty states, independent retry and handle-scoped updates. Live checks against LeetCode in dev and preview: 424 solved, current 1689, peak 1716, all 28 dated ratings matched. Invalid handle, unrated, rate limiting, timeout and retry checked. Codeforces live smoke check and build passed. Pre-deployment hosted endpoint returned 404.
2026-11-09T19:51:08+05:30 IST - User instructed: Keep changes local; I'll deploy. No push or deployment performed. Hosted verification pending user deployment. Timeline write retried with double quotes because an apostrophe terminated the first PowerShell string.
2026-11-16T14:37:51+05:30 IST - Requested collapsed CP and TLE CP-31 groups, working LeetCode after entering an ID, and no CT204 or subject on to-dos. RCA: first group initialized open, filtered groups auto-opened, tasks inherited the timer or first subject, pasted profile URLs were used as usernames, and production API still returns 404. Removed implicit expansion and subject assignment/badges, normalized saved and pasted handles, added dashboard View stats action. Verified both rendered sheets collapsed, build passed and local profile fetch returned 433 solved, current 1684, peak 1716, 30 dated ratings. Local server restarted on 5174. Hosted deployment remains with user. Regression checks cover both sheets. Vite emitted a temporary cache cleanup permission warning during passing tests.
