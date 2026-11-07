import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export function CompletionButton({ completed, onClick, name }) {
  return <button type="button" onClick={onClick} aria-pressed={completed}
    aria-label={`${completed ? 'Mark incomplete' : 'Mark complete'}: ${name}`}
    className={`inline-flex min-h-11 min-w-36 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${completed ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' : 'border-white/15 bg-slate-800 text-slate-200 hover:border-indigo-400 hover:bg-indigo-500/15'}`}>
    {completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
    {completed ? 'Completed' : 'Mark complete'}
  </button>;
}

export default function SheetProgress({ completed, total, revision = 0, topics, label, title, description }) {
  const percent = total ? Math.round(completed / total * 100) : 0;
  return <section className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-5 sm:p-8 space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-widest text-indigo-300">{label}</p>
      <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
      <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-indigo-400/25 bg-slate-950/60 p-5">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-slate-800" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" pathLength="100" strokeDasharray={`${percent} 100`} className="text-indigo-400 transition-all duration-300" />
          </svg><span className="absolute inset-0 flex items-center justify-center text-xl font-bold">{percent}%</span>
        </div>
        <div aria-live="polite"><p className="text-sm text-slate-300">Questions completed</p>
          <p className="mt-1 text-4xl sm:text-5xl font-bold tabular-nums text-white">{completed}<span className="text-lg font-medium text-slate-400"> / {total}</span></p>
          <p className="mt-2 text-xs text-indigo-300">{total - completed} remaining</p></div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"><p className="text-sm text-slate-400">Saved for revision</p><p className="mt-3 text-3xl font-bold text-amber-300">{revision}</p><p className="mt-2 text-xs text-slate-400">Revisit at your own pace</p></div>
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"><p className="text-sm text-slate-400">Topics to explore</p><p className="mt-3 text-3xl font-bold text-cyan-300">{topics}</p><p className="mt-2 text-xs text-slate-400">One problem at a time</p></div>
    </div>
  </section>;
}
