# DESIGN.md — Study Command Centre Design System

All visual changes and token updates must be documented here and maintained uniformly across the application.

---

## 1. Design Philosophy
- **Modern, Focused & Premium:** Dark-mode primary workspace engineered for intense student concentration without visual noise.
- **Glassmorphic Accents:** Subtle transparency, soft border reflections, and restrained blur effects for floating navigation and cards.
- **High Contrast & Readability:** Strict adherence to accessible typography, crisp data hierarchy, and instant scannability for fast study actions.

---

## 2. Color Palette & Tokens

### Base & Backgrounds
| Token | Hex / HSL | Usage |
| :--- | :--- | :--- |
| `--bg-main` | `#0B0F19` (HSL 222, 47%, 7%) | Primary page background |
| `--bg-surface` | `#111827` (Tailwind Gray 900) | Secondary surface / Container base |
| `--bg-card` | `#161F30` (Deep Slate Navy) | Component cards, dashboard widgets |
| `--bg-card-hover` | `#1E293B` (Tailwind Slate 800) | Hovered widget/card background |
| `--bg-glass` | `rgba(17, 24, 39, 0.75)` | Floating headers, sidebar, modals |
| `--border-subtle`| `rgba(255, 255, 255, 0.08)` | Default card border & divider |
| `--border-focus` | `rgba(99, 102, 241, 0.5)` | Active input border & highlight |

### Brand Accents
| Token | Hex / HSL | Usage |
| :--- | :--- | :--- |
| `--primary` | `#6366F1` (Indigo 500) | Primary CTA, action buttons, active tabs |
| `--primary-glow`| `rgba(99, 102, 241, 0.25)` | Glow shadow for buttons & timer |
| `--primary-hover`| `#4F46E5` (Indigo 600) | Button hover state |
| `--secondary` | `#8B5CF6` (Violet 500) | Secondary accents, badges, gradients |
| `--accent-cyan`| `#06B6D4` (Cyan 500) | Coding view accents, contest badges |

### Status & Feedback Colors
| State | Hex / Class | Usage |
| :--- | :--- | :--- |
| **Success** | `#10B981` (Emerald 500) | Completed tasks, streak milestones, passed checks |
| **Warning** | `#F59E0B` (Amber 500) | Upcoming deadlines (due within 48h), break timer |
| **Danger** | `#EF4444` (Rose 500) | Overdue assignments, urgent exam countdowns |
| **Info** | `#3B82F6` (Blue 500) | Informational tags, LeetCode Easy/Medium |

---

## 3. Typography
- **Primary Font Family:** `'Plus Jakarta Sans'`, `'Inter'`, `-apple-system`, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Code / Monospace:** `'JetBrains Mono'`, `'Fira Code'`, monospace (used for timer countdowns, contest clocks, LeetCode/Codeforces handles)

### Scale & Hierarchy
| Level | Tailwind Class | Size / Line Height | Weight | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Timer** | `text-5xl md:text-6xl` | 3rem - 3.75rem | Bold (`700`) | `tracking-tight` |
| **H1 (Page Title)** | `text-2xl md:text-3xl` | 1.875rem | Bold (`700`) | `tracking-tight` |
| **H2 (Section)** | `text-xl` | 1.25rem | Semi-Bold (`600`)| Normal |
| **H3 (Card Title)**| `text-base` | 1rem | Semi-Bold (`600`)| Normal |
| **Body (Default)** | `text-sm` | 0.875rem (14px) | Regular (`400`)| Normal |
| **Caption / Meta** | `text-xs` | 0.75rem (12px) | Medium (`500`) | `tracking-wide` |

---

## 4. Components & Patterns

### 1. Cards & Containers
- `rounded-2xl` with `border border-white/10` and `backdrop-blur-md`
- Box shadow: `shadow-lg shadow-black/30`
- Padding: `p-5` or `p-6`

### 2. Action Buttons
- **Primary:** `bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-95`
- **Secondary / Ghost:** `bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium px-4 py-2.5 rounded-xl transition-all duration-200`

### 3. Study Timer Widget
- Big digital clock in monospace font (`font-mono font-bold text-5xl`)
- Circular SVG progress ring with gradient pulse during active sessions
- Quick switch controls: Pomodoro (25m), Short Break (5m), Long Break (15m), Custom Stopwatch

### 4. Consistency & Heatmaps
- 7-column or 52-week activity grid with GitHub/LeetCode-style green/indigo intensity scale:
  - `bg-white/5` (0 hours)
  - `bg-emerald-950/60` (1-2 hours)
  - `bg-emerald-700` (2-4 hours)
  - `bg-emerald-500` (4-6 hours)
  - `bg-emerald-400 shadow-sm shadow-emerald-400/50` (6+ hours)

---

## 5. Design Maintenance Log
- **2026-11-05T16:51:52+05:30 IST:** Contest calendar now uses a distinct blue panel (#15283b), brighter weekday header (#294660), blue day cells (#1e354c), visible grid borders, sky selection ring, blue CF chips and amber LC chips. Overflow expands inside the day with an accessible Show less toggle. Expected recurring LC dates have an asterisk and explanatory legend; published dates take priority.
- **2026-10-28 20:01 IST:** Initial design specification established from PRD & TRD requirements.

- **2026-11-05T15:35:53+05:30 IST:** CP/DSA sheets share a large progress summary (96px ring, 36–48px completed count), labeled 44px completion buttons, emerald completed rows, amber revision bookmarks, responsive topic cards and visible focus states. DSA uses wider readable table rows with horizontal scrolling; CP rows wrap for narrow screens.

- **2026-11-05T16:37:03+05:30 IST:** Added CP-31 as a secondary Coding sheet card; reused progress/toggle styles. DSA accordion starts entirely collapsed. Rating tooltip changes use emerald gains, rose losses, neutral zero/unavailable. Contest calendar uses Monday-first month grid, blue CF and amber LC chips, indigo today/selection, day-detail panel and mobile horizontal scroll, with all dates/times in IST.
