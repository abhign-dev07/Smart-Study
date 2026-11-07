# Product Requirements Document (PRD)

## Personal Study Command Centre

**Document type:** Product Requirements Document\
**Version:** 1.0\
**Purpose:** Define what the website should do, who it is for, and how
success will be measured.

------------------------------------------------------------------------

## 1. Project Overview

### Project name

**Study Command Centre** (working title; can be renamed later)

### One-line description

A personal, browser-based study productivity website that helps students
organize academic work, track study habits, and monitor coding progress
in one focused workspace.

### Primary goal

Help the user study more consistently, improve academic performance,
remember deadlines, and maintain coding practice without spending time
managing a complicated productivity system.

### Product principles

-   Make it easy to start studying.
-   Keep the interface useful and uncluttered.
-   Prioritize today's actions over statistics.
-   Avoid unnecessary technical and administrative complexity.
-   Keep the first version local-first, with no database or accounts.
-   Use real data for analytics; clearly label demo data.

## 2. Target Users

### Primary users

The creator and friends who want a personal study planner and
coding-progress tracker.

### Initial scope

The first version is designed for personal use on a laptop/desktop. Each
person can open the website on their own computer, but each browser
maintains its own independent data.

### Problems to solve

-   Forgetting assignments and deadlines.
-   Losing track of exam preparation and syllabus completion.
-   Having no clear view of daily study priorities.
-   Inconsistently tracking study hours and routines.
-   Losing sight of coding goals and upcoming contests.
-   Not knowing how study time is distributed across subjects.
-   Using multiple disconnected tools for planning and progress
    tracking.

### Expected outcomes

-   Users can see what to work on today.
-   Users can record assignments and deadlines quickly.
-   Study sessions and targets are tracked consistently.
-   Exam preparation progress is visible.
-   Coding progress and contest dates are easy to review.
-   Users can understand their consistency through charts, streaks, and
    heatmaps.

## 3. Product Structure

The website must have exactly **three primary navigation sections**.

### 3.1 Dashboard

Purpose: Help the user decide what to do today.

At the top: - Today's tasks and to-do items. - Daily study target and
progress. - Upcoming assignments and exams. - A prominent **Start
Study** button. - Quick actions for adding tasks or assignments.

Below: - Coding statistics and coding-goal progress. - Study-hour and
task-completion charts. - Current and longest study streak. - Study
activity heatmap. - Longer-term progress and upcoming contests.

### 3.2 Academics

Purpose: Manage subjects, assignments, exams, syllabus preparation, and
academic study time.

Include: - One simple subject list, without semester divisions. -
Assignment list with pending and completed sections. - Daily to-do
checklist. - Exam schedule and countdowns. - Personal exam-preparation
plans. - Syllabus topic checklist and progress. - Study-session history
and academic analytics.

### 3.3 Coding

Purpose: Track LeetCode and Codeforces activity, goals, and contests.

Include: - LeetCode and Codeforces within the same section. - Profile
usernames/handles saved in Settings. - A **Refresh Stats** button. -
Last successful refresh time and clear error states. - Manual coding
goals and progress corrections. - Upcoming contest list with
countdowns. - Calendar view for contests. - Coding activity charts.

### Secondary Settings

Settings are accessible from a secondary control, not as a fourth
primary navigation section. They contain theme, coding usernames, daily
defaults, streak minimum, reminder preferences, and backup/restore
controls.

## 4. Must-Have Features

### 4.1 Daily dashboard and to-do list

-   Show today's priorities first.
-   Allow quick creation of everyday tasks.
-   Support optional priority (High, Medium, Low) and due time.
-   Allow tasks to be completed or deleted.
-   Keep completed items separate from active items where useful.
-   Show upcoming deadlines and exams, including events beyond the next
    seven days.

### 4.2 Subjects and assignments

-   Users can manually add, rename, and remove subjects.
-   Assignment fields: title, subject, due date, priority, and status.
-   Keep assignment creation quick; descriptions, attachments, and
    subtasks are not required.
-   Anyone using the same browser can add, edit, complete, and delete
    local assignments.
-   Separate pending and completed assignments.
-   No permissions or account system.

### 4.3 Exams and syllabus preparation

-   Record exam date and time.
-   Display countdowns.
-   Allow each user to create personal exam-preparation plans in their
    own browser.
-   Track syllabus topics with Not Started, In Progress, and Completed
    statuses.
-   Show topic-level and overall syllabus progress.
-   Optionally link syllabus topics to assignments or study sessions.
-   Use IST for dates and times.

### 4.4 Study timer

-   Provide Pomodoro presets, such as 25 minutes of study and 5 minutes
    of break.
-   Provide a flexible timer and stopwatch-style option.
-   Allow **Quick Start** without selecting an activity.
-   Optionally link a session to an academic subject, LeetCode, or
    Codeforces.
-   Save completed sessions automatically.
-   Show a small completion summary with options to edit duration or
    activity.
-   Keep session history and use it for analytics.

### 4.5 Daily and monthly goals

-   Users can set default daily targets, such as study hours and coding
    problems.
-   Allow targets to be adjusted for a specific day.
-   Track progress with percentages and progress bars.
-   Support monthly coding goals such as a target number of LeetCode
    problems or Codeforces contests.
-   Coding goals are manually managed, even when platform statistics can
    be fetched.

### 4.6 Study consistency and analytics

-   Show current and longest study streak.
-   Let users choose the minimum study duration that counts toward a
    streak.
-   Include a GitHub-style activity heatmap.
-   Show daily and weekly study hours.
-   Show study time by academic subject.
-   Show monthly progress, completed tasks, goal completion, and coding
    activity.
-   Keep charts visually clear and based on real saved data.

### 4.7 Coding platform statistics

-   Let users save their LeetCode username and Codeforces handle once.
-   Provide a manual **Refresh Stats** button.
-   Fetch data automatically only where reasonably reliable.
-   Never ask for platform passwords.
-   If fetching fails, show the last successful data and an explanation.
-   Provide manual fallback/correction where integrations are
    unavailable.
-   Use official, documented APIs where available; avoid relying on
    fragile undocumented integrations as guaranteed features.

### 4.8 Coding contest calendar

-   Show upcoming contests in a list with platform, date, time, and
    countdown.
-   Also provide a calendar view.
-   Fetch schedules automatically where reliable.
-   Allow manual contest additions and corrections.
-   Avoid duplicate entries when a manual and fetched event refer to the
    same contest.
-   Display contest times in IST.

### 4.9 Reminders

-   Show upcoming deadlines in the website.
-   Allow reminders such as one or three days before an exam or
    assignment.
-   Support in-website reminders and browser notifications where
    supported.
-   Ask permission before enabling browser notifications.
-   Clearly explain that browser/OS restrictions or a closed website may
    prevent background notifications from firing reliably.

### 4.10 Browser-local persistence

-   Save changes immediately.
-   Show a small save indicator such as Saving..., Saved, or Save
    failed.
-   Data persists after refreshing or reopening the same browser
    profile, provided browser data has not been cleared.
-   Handle storage errors gracefully.

### 4.11 Backup and restore

-   Export data to a downloadable backup file.
-   Import a previously exported backup.
-   Validate imported data and confirm before replacing current data.
-   Clearly warn that clearing browser data can erase saved information.

### 4.12 Themes and navigation

-   Dark mode by default.
-   Optional light mode in Settings.
-   Collapsible sidebar inspired by the supplied visual references.
-   Sidebar contains Dashboard, Academics, and Coding only.
-   Remember the selected theme and sidebar state locally.

### 4.13 First-use experience

On first use, offer: - **Start fresh:** an empty dashboard with helpful
prompts. - **Explore demo:** a sample dashboard with clearly labelled
example data.

Demo data must not be confused with real activity. Users must be able to
remove demo data and start fresh without silently overwriting real data.

### 4.14 Optional recurring tasks

-   Support simple daily and weekly recurring tasks.
-   Keep recurrence controls secondary and out of the default
    quick-entry flow.
-   Prevent duplicate generated tasks.

## 5. Nice-to-Have / Secondary Features

-   More chart filters and date ranges.
-   Additional timer presets.
-   More advanced recurring routines.
-   Extra coding statistics when reliable sources support them.
-   Additional customization of dashboard widgets.

These should not delay the core planner, timer, local persistence,
backup/restore, and main sections.

## 6. Design Requirements

### Desired feel

A distinctive, polished, dark developer-focused productivity dashboard
with an academic identity. Use the two supplied dashboard images as
visual inspiration.

### Visual direction

-   Dark/black base.
-   Green accents for coding.
-   Blue accents for academic information.
-   Selective purple highlights.
-   Strong typography and purposeful spacing.
-   Activity heatmaps and clear data visualizations.
-   Compact, collapsible sidebar.
-   Optional light theme.

### Avoid

-   Generic AI-generated dashboard templates.
-   Excessive blue/purple gradients.
-   Too many repetitive cards.
-   Unnecessary decorative elements.
-   Cluttered layouts that hide today's tasks.
-   Animations that slow down routine use.

### Responsive scope

Desktop/laptop is the initial priority. Keep the interface usable at
smaller widths where practical, but a dedicated mobile app is not
required.

## 7. Data, Privacy, and Limitations

### Local-only data

All personal records are stored in the user's browser on that computer.
There is no login, database, cloud storage, or automatic
synchronization.

### Consequences

-   Data does not automatically appear on friends' computers.
-   Assignments and exam dates entered in one browser are not
    automatically shared with another.
-   Clearing browser storage may erase records.
-   Backup/export is the intended way to protect or move data in the
    first version.

### Explicit exclusions

-   User accounts, authentication, invitation links, and permissions.
-   Shared data across different computers.
-   Cloud database or cloud file storage.
-   Attendance tracking.
-   Lecture PDF library or file sharing.
-   Social features, leaderboards, or friend comparisons.
-   Separate Android/iOS application.
-   Payments or subscriptions.
-   Guaranteed notifications when the website is fully closed.

## 8. Technical Direction (Product-Level)

The separate TRD defines implementation details. At a high level, the
project should use: - React.js and JavaScript/JSX. - Node.js only if a
small local service is genuinely needed for an integration. - Tailwind
CSS. - Browser storage instead of a database. - A React-compatible
charting library selected by the implementer. - Local development on
localhost first.

The implementation should be maintainable and avoid unnecessary
dependencies or backend complexity.

## 9. Success Criteria

The product is successful when:

1.  The user can open the dashboard and immediately understand today's
    priorities.
2.  Subjects and assignments can be added, edited, completed, and
    deleted easily.
3.  Exam dates, countdowns, and syllabus progress are easy to maintain.
4.  Study sessions are recorded accurately and contribute to analytics.
5.  Daily targets, streaks, and heatmaps reflect actual local data.
6.  Coding statistics refresh when requested, or clearly fall back when
    unavailable.
7.  Coding goals can be tracked manually without depending on
    integrations.
8.  Upcoming contests appear in a list and calendar where reliable data
    is available.
9.  Backup and restore work safely.
10. Theme and sidebar preferences persist.
11. Demo data is clearly labelled and removable.
12. The website works locally without requiring a database or account
    setup.
13. The interface is distinctive, readable, and focused on helping the
    user study.
14. The website does not claim to synchronize data between separate
    computers.

## 10. Delivery Expectations

The initial version should prioritize a polished, usable core experience
over feature quantity. Build the Dashboard, Academics, Coding, local
storage, backup/restore, study timer, goals, and basic analytics first.
Add optional integrations only when they can be implemented reliably.

The separate TRD should be followed for technical architecture, project
structure, storage behavior, integration constraints, testing, and local
run instructions.
