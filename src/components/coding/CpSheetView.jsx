import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bookmark, ChevronDown, ChevronRight, ExternalLink, Search } from 'lucide-react';
import SheetProgress, { CompletionButton } from './SheetProgress';
import defaultCatalogue from '../../data/cpSheetData.json';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/mockData';

export default function CpSheetView({ onBack, catalogue = defaultCatalogue, storageKey = STORAGE_KEYS.CP_SHEET_PROGRESS }) {
  const allProblems = catalogue.topics.flatMap(t => t.problems);
  const [progress, setProgress] = useState(() => getStoredData(storageKey, {}));
  const [expanded, setExpanded] = useState({});
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [platform, setPlatform] = useState('ALL');
  const [rating, setRating] = useState('ALL');
  useEffect(() => { setStoredData(storageKey, progress); }, [progress, storageKey]);
  const toggle = (id, field) => setProgress(previous => ({ ...previous, [id]: { ...previous[id], [field]: !previous[id]?.[field] } }));
  const matches = p => {
    const state = progress[p.id] || {};
    if (!`${p.name} ${p.code} ${p.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    if (platform !== 'ALL' && platform !== p.platform) return false;
    if (rating === 'UNRATED' && p.rating) return false;
    if (rating !== 'ALL' && rating !== 'UNRATED' && (!p.rating || p.rating > Number(rating))) return false;
    return status === 'ALL' || (status === 'SOLVED' && state.solved) || (status === 'UNSOLVED' && !state.solved) || (status === 'REVISION' && state.revised);
  };
  const filteredTopics = catalogue.topics.map(t => ({ ...t, visible: t.problems.filter(matches) })).filter(t => t.visible.length);
  const filtering = Boolean(query.trim() || status !== 'ALL' || platform !== 'ALL' || rating !== 'ALL');
  const clearFilters = () => { setQuery(''); setStatus('ALL'); setPlatform('ALL'); setRating('ALL'); };
  const inputClass = 'min-h-11 rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-2 focus:outline-indigo-400';
  return <div className="space-y-6">
    <button onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16} />Back to Coding Dashboard</button>
    <SheetProgress completed={allProblems.filter(p => progress[p.id]?.solved).length} total={allProblems.length} revision={allProblems.filter(p => progress[p.id]?.revised).length} topics={catalogue.topics.length} label={catalogue.label || "Striver's competitive programming sheet"} title={catalogue.title || "Your CP roadmap"} description="A topic-by-topic practice plan. Open a problem, solve it, and mark your progress here." />
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
      <p>Imported from <a href={catalogue.repository} target="_blank" rel="noreferrer" className="text-indigo-300 underline">{catalogue.sourceLabel || "arnavsharma2711 / CP-Striver-Sheet"}</a> · {allProblems.length} entries · Progress saved in this browser</p>
      {!catalogue.label && <p>Some source files contain a problem link only.</p>}
    </div>
    <div className="glass-panel rounded-2xl p-4 space-y-4">
      <div className="flex flex-wrap gap-3">
        <label className="relative flex-1 min-w-48"><Search size={18} className="absolute left-3 top-3 text-slate-400" /><input aria-label="Search CP problems" value={query} onChange={e => { setQuery(e.target.value); setExpanded({}); }} placeholder="Search question, ID, or tag..." className={`${inputClass} w-full pl-10`} /></label>
        <select aria-label="Filter CP status" value={status} onChange={e => { setStatus(e.target.value); setExpanded({}); }} className={inputClass}><option value="ALL">All questions</option><option value="UNSOLVED">To complete</option><option value="SOLVED">Completed</option><option value="REVISION">Saved for revision</option></select>
        <select aria-label="Filter platform" value={platform} onChange={e => { setPlatform(e.target.value); setExpanded({}); }} className={inputClass}><option value="ALL">All platforms</option>{[...new Set(allProblems.map(p => p.platform))].map(p => <option key={p}>{p}</option>)}</select>
        <select aria-label="Filter maximum rating" value={rating} onChange={e => { setRating(e.target.value); setExpanded({}); }} className={inputClass}><option value="ALL">All ratings</option>{[1000, 1200, 1600, 2000, 2400, 3500].map(r => <option value={r} key={r}>Up to {r}</option>)}<option value="UNRATED">Unrated</option></select>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm"><span className="text-slate-400">{filteredTopics.reduce((sum, t) => sum + t.visible.length, 0)} questions shown</span><div className="flex gap-4">
        {filtering ? <button onClick={clearFilters} className="text-indigo-300 hover:underline">Clear filters</button> : <><button onClick={() => setExpanded(Object.fromEntries(catalogue.topics.map(t => [t.id, true])))} className="text-indigo-300 hover:underline">Expand all</button><button onClick={() => setExpanded({})} className="text-slate-300 hover:underline">Collapse all</button></>}
      </div></div>
    </div>
    {!filteredTopics.length && <div className="glass-panel rounded-2xl p-10 text-center"><h3 className="text-lg font-semibold">No matching questions</h3><p className="mt-2 text-sm text-slate-400">Try another search or clear your filters.</p></div>}
    <div className="space-y-4">{filteredTopics.map(topic => {
      const open = Boolean(expanded[topic.id]);
      const solved = topic.problems.filter(p => progress[p.id]?.solved).length;
      return <section key={topic.id} className="glass-panel rounded-2xl overflow-hidden">
        <button onClick={() => setExpanded(previous => ({ ...previous, [topic.id]: !open }))} aria-expanded={Boolean(open)} aria-controls={`cp-topic-${topic.id}`} className="w-full flex items-center gap-3 p-5 text-left hover:bg-white/5">
          {open ? <ChevronDown size={18} className="shrink-0" /> : <ChevronRight size={18} className="shrink-0" />}<span className="text-sm font-mono text-indigo-300">{topic.id}</span><h3 className="flex-1 font-semibold text-sm sm:text-base">{topic.title}</h3><span className="shrink-0 text-sm text-slate-300 tabular-nums">{solved} / {topic.problems.length}</span>
          <span className="hidden sm:block h-2 w-24 rounded-full bg-slate-950 overflow-hidden"><span className="block h-full bg-indigo-400" style={{ width: `${solved / topic.problems.length * 100}%` }} /></span>
        </button>
        {open && <ul id={`cp-topic-${topic.id}`} className="divide-y divide-white/10 border-t border-white/10">{topic.visible.map(p => {
          const state = progress[p.id] || {};
          return <li key={p.id} className={`flex flex-wrap items-center gap-4 p-5 ${state.solved ? 'bg-emerald-500/5' : ''}`}>
            <CompletionButton completed={Boolean(state.solved)} onClick={() => toggle(p.id, 'solved')} name={p.name} />
            <div className="flex-1 min-w-40"><a href={p.url} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 font-semibold hover:text-indigo-300 ${state.solved ? 'text-emerald-200' : 'text-slate-100'}`}>{p.name}<ExternalLink size={15} className="shrink-0" /></a><p className="mt-1 text-xs text-slate-400">{p.platform} · {p.code} · {p.rating ? `Rating ${p.rating}` : 'Unrated'}</p></div>
            {p.sourceUrl && <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs text-slate-400 hover:text-white">{p.hasSolution ? 'C++ solution' : 'Source reference'}<ExternalLink size={14} /></a>}
            <button onClick={() => toggle(p.id, 'revised')} aria-pressed={Boolean(state.revised)} aria-label={`${state.revised ? 'Remove revision bookmark' : 'Save for revision'}: ${p.name}`} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm ${state.revised ? 'border-amber-400/30 text-amber-300 bg-amber-400/10' : 'border-white/10 text-slate-400 hover:text-white'}`}><Bookmark size={18} fill={state.revised ? 'currentColor' : 'none'} />Revision</button>
          </li>;
        })}</ul>}
      </section>;
    })}</div>
  </div>;
}
