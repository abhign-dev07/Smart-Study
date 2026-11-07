# Technical Requirements Document (TRD)

## Personal Study Command Centre

**Document type:** Technical Requirements Document\
**Version:** 1.0\
**Purpose:** Technical implementation guide for Antigravity\
**Project approach:** Local-first, browser-stored data; no database

------------------------------------------------------------------------

## 1. Technical Overview

Build a desktop-first study productivity website with three main
sections:

1.  **Dashboard**
2.  **Academics**
3.  **Coding**

The application should be straightforward to run and test on
`localhost`. Use React, JavaScript, Node.js, Tailwind CSS, and standard
HTML/CSS concepts. Do not add a database, authentication system, cloud
storage, or user-permission system.

### Required technology stack

-   **Frontend:** React.js
-   **Language:** JavaScript (JSX). TypeScript is not required.
-   **Development/build tooling:** Vite
-   **Backend/runtime:** Node.js only where a small local server or API
    proxy is genuinely needed
-   **Styling:** Tailwind CSS
-   **Markup:** Semantic HTML elements through React JSX
-   **Local persistence:** Browser `localStorage` for settings and small
    records; use IndexedDB only if the amount of local data makes it
    more suitable
-   **Charts:** Choose a stable React-compatible chart library, such as
    Recharts, if it is helpful
-   **Icons:** Use a consistent icon library such as Lucide React
-   **Calendar/date handling:** Use a reliable date utility only if
    needed; display dates and times in Indian Standard Time (IST,
    UTC+05:30)
-   **Testing:** Basic manual testing plus suitable automated checks for
    important logic

Antigravity should choose compatible current stable package versions and
install/configure them. Do not ask the user to choose libraries or other
implementation details.

## 2. Architecture

Use a simple client-side architecture.

-   React renders the interface and manages application state.
-   Tailwind CSS handles layout, spacing, responsive behavior, and
    visual styling.
-   Browser storage persists the user's data on that browser and
    computer.
-   A Node.js server is not needed for ordinary local storage or basic
    frontend functionality. Include a small Node.js server only if
    required for a supported integration, such as safely proxying a
    third-party API request. Keep it optional and minimal.
-   Do not create a database schema or connect to a hosted database.

### Important data limitation

Browser-stored data belongs to the browser profile on that computer. It
does not automatically synchronize between different laptops or
browsers. The first version must not imply that one user's changes are
visible to friends on their own devices.

The app may be deployed as a website later, but deployment alone will
not create synchronization. Shared multi-device data would require a
separate future architecture decision.

## 3. Suggested Project Structure

Use a clear, maintainable structure similar to the following.
Antigravity may adjust filenames if the result remains organized and
easy to maintain.

``` text
study-command-centre/
├── public/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── routes.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── PageHeader.jsx
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── academics/
│   │   ├── coding/
│   │   ├── timer/
│   │   └── charts/
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── AcademicsPage.jsx
│   │   ├── CodingPage.jsx
│   │   └── SettingsPage.jsx
│   ├── hooks/
│   ├── services/
│   │   ├── storageService.js
│   │   ├── backupService.js
│   │   ├── codingStatsService.js
│   │   └── contestService.js
│   ├── utils/
│   ├── data/
│   │   └── demoData.js
│   ├── styles/
│   └── main.jsx
├── server/                  # Optional minimal Node.js service only if needed
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

Do not create empty placeholder files for every possible feature. Add
files as the implementation needs them.

## 4. Data Storage Requirements

### 4.1 Storage rules

-   Use `localStorage` for small, frequently accessed records and
    preferences.
-   Keep storage access behind a dedicated `storageService` so
    components do not directly manipulate storage everywhere.
-   Save changes immediately after a user adds, edits, deletes,
    completes, or updates a record.
-   Display a small status indicator such as **Saving...**, **Saved**,
    or **Save failed**.
-   Handle unavailable storage, malformed JSON, and quota errors
    gracefully.
-   Version the stored data structure so future updates can migrate or
    safely reject incompatible data.
-   Never store passwords or authentication credentials; the application
    has no login system.
-   Do not store lecture PDFs or implement a lecture library in this
    version.
-   Use IndexedDB instead of `localStorage` if the implementation later
    needs to store larger datasets. Do not add IndexedDB pre-emptively
    without a reason.

### 4.2 Data entities

Store appropriate records for:

-   Subjects
-   Assignments
-   Daily to-do tasks
-   Exams and exam-preparation plans
-   Syllabus topics
-   Study sessions
-   Daily and monthly goals
-   Coding goals and manually entered progress
-   Coding platform usernames
-   Contest events and manually added events
-   Reminder preferences
-   Theme and interface preferences
-   Recurring tasks, when enabled
-   User-created settings

Each record should have a stable unique ID and creation/update
timestamps where useful.

### 4.3 Shared versus local information

The first version has no accounts, permissions, or cloud database. Each
browser has its own copy of all records, including assignments and exam
dates. Include clear documentation that data is local to that browser.

## 5. Backup and Restore

Implement **Export Backup** and **Import Backup**.

-   Export application data to a downloadable JSON file.
-   Include a format/version identifier and export timestamp.
-   Validate imported JSON and required fields before applying it.
-   Show a clear confirmation before replacing current data.
-   If practical, offer a way to download the current data before
    replacing it.
-   Display a helpful error for invalid or incompatible backup files.
-   Do not import executable code or interpret imported content as HTML.

## 6. Main Interface and Navigation

### 6.1 Main sections

The application must have exactly three primary navigation sections:

1.  Dashboard
2.  Academics
3.  Coding

Settings may be accessed through a secondary settings control and must
not become a fourth primary section.

### 6.2 Sidebar

-   Dark, compact, collapsible sidebar inspired by the user's supplied
    dashboard references.
-   Show clear active-section styling.
-   Use icons consistently and provide accessible labels.
-   Sidebar collapse state should persist locally.
-   Avoid excessive cards, gradients, and generic dashboard patterns.

### 6.3 Themes

-   Dark mode is the default.
-   Provide an optional light mode in Settings.
-   Persist the theme preference locally.
-   Ensure text, controls, charts, focus states, and disabled states
    remain readable in both themes.

### 6.4 Desktop-first behavior

-   Optimize the initial implementation for laptop/desktop screens.
-   Keep the layout usable at smaller widths where practical, but a
    dedicated mobile experience is not part of the initial scope.
-   Avoid horizontal overflow at common laptop resolutions.

## 7. Dashboard Requirements

The dashboard must prioritize action over analytics.

### Top priority area

-   Today's tasks and to-do items
-   Daily study target and progress
-   Upcoming deadlines and exams
-   A prominent **Start Study** action
-   Quick access to create a task or assignment

### Lower dashboard area

-   Coding statistics and goals
-   Study-hour and completion charts
-   Study streak and activity heatmap
-   Longer-term progress and upcoming contests

Include useful empty states when there is no data. Do not show fake
numbers as real progress.

## 8. Academics Requirements

The Academics section must support:

-   A single subject list; no semester hierarchy in the initial version.
-   Manual creation, renaming, and deletion of subjects.
-   Simple assignments with title, subject, due date, priority, and
    status.
-   Anyone using that browser can add, edit, complete, and delete
    records; no permission restrictions.
-   Pending assignments shown separately from completed assignments.
-   A daily to-do checklist with optional priority and due time.
-   Exams with date, time, countdown, and personal preparation plan.
-   Syllabus topics with **Not Started**, **In Progress**, and
    **Completed** statuses.
-   Topic-level and overall syllabus progress.
-   Optional links between topics, assignments, and study sessions.
-   Academic study-time tracking overall and per subject.
-   Weekly and monthly academic charts.

Do not include attendance tracking, lecture PDF storage, or a shared
resource library.

## 9. Coding Requirements

The Coding section should contain LeetCode and Codeforces within the
same section, not as separate primary navigation items.

### 9.1 Platform profiles

-   Allow the user to enter a LeetCode username and Codeforces handle
    once in Settings.
-   Do not request or store platform passwords.
-   Provide a **Refresh Stats** button.
-   Show the last successful refresh time.
-   If fetching fails, keep the last successful result and explain the
    issue clearly.
-   Do not fabricate missing statistics or imply a fetch succeeded when
    it did not.

### 9.2 Integration behavior

-   Use official, documented APIs where available and suitable.
-   Codeforces statistics may be fetched through its public API where
    practical.
-   LeetCode public data access may be limited or unsupported. Do not
    depend on undocumented endpoints as if they were guaranteed.
-   If an integration cannot be implemented reliably, provide a manual
    fallback.
-   If browser CORS or platform restrictions prevent a request, consider
    a small Node.js proxy only if it is simple, permitted, and safe.
    Never put secret API keys in frontend code.
-   If a proxy is not practical, keep that integration manual rather
    than building a fragile workaround.

### 9.3 Coding goals

Coding goals are manually managed, even if some platform statistics are
fetched automatically.

Examples: - Monthly LeetCode problem target - Monthly Codeforces contest
target

Support target, current progress, and completion percentage. Allow
manual correction.

### 9.4 Contest schedules

-   Show upcoming contests in a list with platform, date/time, and
    countdown.
-   Also provide a calendar view.
-   Fetch upcoming contest schedules automatically where reliable.
-   Allow manual contest additions and corrections.
-   Avoid duplicates between fetched and manually entered events when
    they represent the same contest.
-   Display times in IST.
-   Treat LeetCode's commonly recurring contest times as a useful
    expectation, not a guarantee; use a reliable schedule source when
    possible.
-   Codeforces schedules vary, so use current contest data when
    available.

## 10. Study Timer Requirements

Provide both Pomodoro presets and a flexible timer.

-   Include a configurable Pomodoro preset, such as 25 minutes of study
    and 5 minutes of break.
-   Allow custom durations and stopwatch-style timing.
-   Support **Quick Start** without requiring a category.
-   Allow the user to optionally choose a subject, LeetCode, or
    Codeforces activity before starting.
-   Save completed sessions automatically.
-   After completion, show a small summary with options to correct
    duration or activity.
-   Keep a session history.
-   Count recorded sessions toward study-hour analytics.
-   Handle refreshes or tab closure sensibly. Do not rely on a
    continuously running interval to calculate elapsed time; record
    start timestamps and calculate elapsed duration from timestamps.
-   Use browser notification permissions only when needed and with user
    consent.

## 11. Goals, Streaks, and Analytics

### 11.1 Goals

-   Allow custom daily and monthly targets.
-   Provide default daily targets that can be adjusted for an individual
    day.
-   Track study-time goals and coding goals separately.
-   Show progress bars and completion percentages.

### 11.2 Streaks

-   Let the user configure a minimum study duration for a day to count
    toward a streak.
-   Calculate current and longest streaks using completed study sessions
    and the configured minimum.
-   Use IST when determining the calendar day.

### 11.3 Visual analytics

Include charts for: - Daily and weekly study hours - Academic study time
by subject - Monthly study progress - Task completion and goal
completion - Coding activity and coding-goal progress - Study
consistency and an activity heatmap

Charts must use actual stored or fetched data. Show a clear empty state
when no data exists. Use a consistent visual style and accessible
labels.

## 12. Reminders and Notifications

-   Show upcoming deadlines on the dashboard.
-   Let users configure reminders, such as one or three days before an
    exam or assignment.
-   Support in-website reminders and browser notifications where
    supported.
-   Request browser notification permission only after the user opts in.
-   Clearly explain that browser notifications may not work if the
    browser or operating system blocks them, permissions are denied, or
    the site is not running in a suitable context.
-   Do not promise reliable background notifications when the website is
    fully closed.
-   Keep reminders optional.

## 13. Recurring Tasks

Recurring tasks are optional and secondary.

-   Support simple daily and weekly recurrence where practical.
-   Avoid generating duplicate tasks after refresh.
-   Clearly define whether a recurrence creates a new dated task or
    updates a template.
-   Do not let recurring-task controls clutter the default task creation
    flow.

## 14. Demo Mode and Empty States

On first use, offer two choices:

-   **Start fresh:** Open an empty dashboard.
-   **Explore demo:** Load clearly labelled sample subjects,
    assignments, study sessions, charts, and coding statistics.

Requirements: - Demo data must be distinguishable from real user data. -
Provide a clear way to remove demo data and start fresh. - Never mix
sample activity into real analytics without explicit user action. - Do
not silently overwrite real data when changing modes.

## 15. Date and Time Rules

-   Use Indian Standard Time (IST, UTC+05:30) for dates, daily
    boundaries, study streaks, reminders, exam countdowns, and contest
    display.
-   Store timestamps in a consistent format and convert for display as
    needed.
-   Handle date-only values (such as an exam date) separately from
    timestamps to avoid accidental date shifts.
-   Make countdowns accurate and avoid hardcoding stale contest dates.

## 16. HTML, Accessibility, and Quality Requirements

Use semantic HTML through React JSX:

-   `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<form>`,
    `<label>`, `<button>`, `<input>`, `<select>`, `<textarea>`, and
    appropriate heading levels.
-   Use buttons for actions and links for navigation.
-   Associate labels with form controls.
-   Support keyboard navigation and visible focus states.
-   Provide accessible names for icon-only buttons.
-   Do not use clickable `<div>` elements when a button or link is
    appropriate.
-   Use meaningful alternative text for informative images.
-   Maintain readable contrast in dark and light themes.
-   Show validation errors near the relevant field.
-   Confirm destructive actions such as deleting a subject or replacing
    data from a backup.
-   Avoid unsafe HTML injection and do not render imported text as raw
    HTML.

## 17. Performance and Reliability

-   Keep the application responsive on a typical laptop.
-   Avoid unnecessary dependencies and excessive animations.
-   Split components by feature and reuse shared UI elements.
-   Handle empty, loading, error, and success states.
-   Handle storage failures gracefully.
-   Avoid repeated API calls; fetch coding statistics only when the user
    presses Refresh Stats.
-   Keep a timestamp for the last successful refresh.
-   Do not block the whole application if one integration fails.
-   Keep the app usable when offline, except for features that require
    external data.

## 18. Security and Privacy

-   No accounts, login, cloud database, or remote user profiles in this
    version.
-   Keep personal data in browser storage.
-   Do not request platform passwords.
-   Do not put private API keys or secrets in frontend code.
-   Validate all user-entered values and imported backup files.
-   Treat fetched third-party data as untrusted content and render it as
    text.
-   Explain the local-data limitation in the interface or README.
-   Include a warning that clearing browser storage can erase data;
    recommend regular exports.

## 19. Explicitly Out of Scope

Do not implement these in the initial version:

-   Database or cloud storage
-   User accounts, authentication, invitations, or permissions
-   Cross-device or cross-user synchronization
-   Shared assignment or exam calendars across separate laptops
-   Attendance tracking
-   Lecture PDF library or file sharing
-   Payments or subscriptions
-   Separate Android/iOS application
-   Advanced social features, leaderboards, or friend comparisons
-   A complicated administration panel
-   Guaranteed background notifications after the browser is closed

## 20. Acceptance Criteria

The initial version is considered ready when:

1.  It runs locally using documented commands.
2.  The three primary sections are Dashboard, Academics, and Coding.
3.  The sidebar can collapse and expand.
4.  Dark mode is the default, and light mode can be enabled.
5.  Changes to tasks, assignments, subjects, goals, and sessions persist
    after refresh in the same browser.
6.  The interface displays save status and handles storage failures.
7.  Export and import backup work with validation and confirmation.
8.  Users can manage subjects and assignments.
9.  Exam countdowns and syllabus progress work.
10. Pomodoro and flexible timers save completed sessions.
11. Study targets, streaks, heatmaps, and charts reflect actual local
    data.
12. Coding goals work manually, regardless of integration availability.
13. Codeforces and LeetCode refresh features either work reliably or
    clearly fall back to manual tracking.
14. Upcoming contests can be shown in a list and calendar, with manual
    additions available.
15. Reminder settings and browser notifications behave within browser
    limitations.
16. Demo mode is clearly labelled and can be removed without
    contaminating real data.
17. No feature claims to synchronize data across different computers.
18. The interface is visually distinctive, polished, keyboard-usable,
    and free of obvious console errors.

## 21. Run Instructions and Handover

Antigravity should:

-   Create the project and install dependencies.
-   Provide a working `package.json` with simple commands such as
    `npm install` and `npm run dev`.
-   Ensure the project launches on localhost without manual code edits.
-   Include a README with setup, run, build, backup, storage
    limitations, and integration notes.
-   Explain any feature that had to use manual fallback.
-   Run a production build and fix build errors before handing over.
-   Avoid claiming a feature is complete if it is only a placeholder.

**Implementation priority:** Build a polished, dependable local-first
study planner first. Add optional external integrations only when they
can be implemented reliably without turning the project into a
complicated backend system.
