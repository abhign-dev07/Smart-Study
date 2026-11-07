import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, CalendarDays, ExternalLink } from 'lucide-react';
import snapshot from '../../data/contestSnapshot.json';
import { IST, istDay, calendarDays, normalizeContests, withLeetcodeRecurrence, fetchContestSchedules } from '../../utils/contestCalendar';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/mockData';

export default function ContestCalendar() {
  const [today, setToday] = useState(() => istDay(Date.now()));
  const [year, month] = today.split('-').map(Number);
  const [view, setView] = useState({ year, month: month - 1 });
  const [selected, setSelected] = useState(today);
  const [expandedDays, setExpandedDays] = useState({});
  const detailsRef = useRef(null);
  function showDay(key) { setSelected(key); detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  const [filter, setFilter] = useState('All');
  const [cache, setCache] = useState(() => getStoredData(STORAGE_KEYS.CONTEST_CALENDAR, { ...snapshot, cfUpdated: snapshot.fetchedAt, lcUpdated: snapshot.fetchedAt }));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Showing saved schedules and expected LeetCode dates.');
  useEffect(() => { const timer = setInterval(() => setToday(istDay(Date.now())), 60000); return () => clearInterval(timer); }, []);
  async function refresh() {
    setLoading(true);
    try {
      const { cf, lc } = await fetchContestSchedules();
      const now = new Date().toISOString();
      setCache(previous => {
        const next = { ...previous };
        if (cf.status === 'fulfilled') { next.codeforces = cf.value; next.cfUpdated = now; }
        if (lc.status === 'fulfilled') { next.leetcode = lc.value; next.lcUpdated = now; }
        setStoredData(STORAGE_KEYS.CONTEST_CALENDAR, next);
        return next;
      });
      const failed = [cf.status === 'rejected' && 'Codeforces', lc.status === 'rejected' && 'LeetCode'].filter(Boolean);
      setMessage(failed.length ? `${failed.join(' and ')} could not refresh. Keeping its saved schedule.` : 'Schedules updated from Codeforces and LeetCode.');
    } catch { setMessage('Unable to refresh. Showing the saved schedule.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);
  const events = withLeetcodeRecurrence(normalizeContests(cache.codeforces, cache.leetcode), view.year, view.month).filter(c => filter === 'All' || c.platform === filter);
  const days = calendarDays(view.year, view.month);
  const byDay = new Map();
  for (const event of events) { const key = istDay(event.start); byDay.set(key, [...(byDay.get(key) || []), event]); }
  const selectedEvents = byDay.get(selected) || [];
  const monthLabel = new Date(Date.UTC(view.year, view.month, 1)).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const time = value => new Date(value).toLocaleTimeString('en-IN', { timeZone: IST, hour: '2-digit', minute: '2-digit' });
  function moveMonth(offset) { const date = new Date(Date.UTC(view.year, view.month + offset, 1)); setView({ year: date.getUTCFullYear(), month: date.getUTCMonth() }); setSelected(date.toISOString().slice(0, 10)); }
  const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-sm text-slate-300 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-indigo-400';
  return <section className="rounded-3xl border border-sky-300/30 bg-[#15283b] p-4 sm:p-6 space-y-4 shadow-xl shadow-sky-950/30">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 text-xl font-bold"><CalendarDays size={22} className="text-indigo-300" />Contest calendar</h2><p className="mt-1 text-xs text-slate-400">All times in IST · Weekly: Sunday 8 AM · Biweekly: alternate Saturday 8 PM</p></div><button onClick={refresh} disabled={loading} className={`${buttonClass} disabled:opacity-50`}><RefreshCw size={15} className={loading ? 'animate-spin' : ''} />{loading ? 'Refreshing…' : 'Refresh'}</button></div>
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><button aria-label="Previous month" className={buttonClass} onClick={() => moveMonth(-1)}><ChevronLeft size={18} /></button><h3 className="min-w-36 text-center font-semibold">{monthLabel}</h3><button aria-label="Next month" className={buttonClass} onClick={() => moveMonth(1)}><ChevronRight size={18} /></button><button className={buttonClass} onClick={() => { setView({ year, month: month - 1 }); setSelected(today); }}>Today</button></div><select aria-label="Filter contest platform" value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm"><option>All</option><option>Codeforces</option><option>LeetCode</option></select></div>
    <div className="flex flex-wrap gap-4 text-xs text-slate-200"><span className="text-sky-300">● Codeforces</span><span className="text-amber-300">● LeetCode</span><span>* Expected recurring date — published dates take priority</span></div>
    <div className="overflow-x-auto rounded-2xl border border-slate-400/40"><div className="min-w-[700px]"><div className="grid grid-cols-7 bg-[#294660]">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="p-3 text-center text-xs font-semibold uppercase text-slate-100">{d}</div>)}</div><div className="grid grid-cols-7">{days.map(day => {
      const contests = byDay.get(day.key) || [];
      const expanded = Boolean(expandedDays[day.key]);
      return <div key={day.key} className={`min-h-32 border-t border-r border-slate-400/30 p-2 ${day.current ? 'bg-[#1e354c]' : 'bg-[#142638]'} ${selected === day.key ? 'ring-2 ring-inset ring-sky-300' : ''}`}>
        <button onClick={() => showDay(day.key)} aria-label={`View contests on ${day.key}`} aria-pressed={selected === day.key} className={`mb-2 h-8 w-8 rounded-full text-sm ${day.key === today ? 'bg-indigo-500 font-bold text-white' : 'text-slate-300 hover:bg-white/10'}`}>{day.day}</button>
        <div className="space-y-1">{contests.slice(0, expanded ? contests.length : 2).map(c => <button key={c.id} onClick={() => showDay(day.key)} title={`${c.title} · ${time(c.start)} IST${c.expected ? " · Expected recurring schedule" : ""}`} className={`block w-full truncate rounded-md border-l-2 px-2 py-1.5 text-left text-xs ${c.platform === 'Codeforces' ? 'border-sky-300 bg-[#235182] text-sky-50 hover:bg-[#2e6399]' : 'border-amber-300 bg-[#675122] text-amber-50 hover:bg-[#80632a]'}`}>{c.platform === 'Codeforces' ? 'CF' : 'LC'} · {c.title}{c.expected ? ' *' : ''}</button>)}{contests.length > 2 && <button type="button" aria-label={`${expanded ? 'Show fewer' : 'Show all'} contests on ${day.key}`} aria-expanded={expanded} className="min-h-8 rounded-md px-2 text-sm font-semibold text-sky-200 hover:bg-sky-300/15 focus-visible:outline-2 focus-visible:outline-sky-300" onClick={() => { setExpandedDays(previous => ({ ...previous, [day.key]: !previous[day.key] })); setSelected(day.key); }}>{expanded ? 'Show less' : `+${contests.length - 2} more`}</button>}</div>
      </div>;
    })}</div></div></div>
    <div ref={detailsRef} className="rounded-2xl border border-sky-300/20 bg-[#203c54] p-4"><h3 className="text-sm font-semibold">{selected} · IST</h3>{!selectedEvents.length ? <p className="mt-2 text-sm text-slate-400">No contests in the schedule for this date.</p> : <ul className="mt-3 space-y-3">{selectedEvents.map(c => <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 text-sm"><a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-200 hover:underline">{c.title}{c.expected ? " (expected)" : ""}<ExternalLink size={14} /></a><span className="text-slate-400">{c.platform} · {time(c.start)} IST · {Math.round(c.duration / 60)} min</span></li>)}</ul>}</div>
    <p role="status" className="text-xs text-slate-400">{message}</p>
    <p className="text-xs text-slate-300">Saved: CF {new Date(cache.cfUpdated || cache.fetchedAt).toLocaleString('en-IN', {timeZone:IST})} · LC {new Date(cache.lcUpdated || cache.fetchedAt).toLocaleString('en-IN', {timeZone:IST})} IST</p>
  </section>;
}
