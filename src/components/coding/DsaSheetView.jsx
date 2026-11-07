import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, ChevronRight, 
  ExternalLink, Bookmark, Search, 
  ArrowLeft 
} from 'lucide-react';
import { STRIVER_TOPICS, ALL_STRIVER_PROBLEMS } from '../../data/striverSheetData';
import SheetProgress, { CompletionButton } from './SheetProgress';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/mockData';

export default function DsaSheetView({ onBack }) {
  // User progress state: { [problemId]: { solved: boolean, revised: boolean } }
  const [progress, setProgress] = useState(() => getStoredData(STORAGE_KEYS.DSA_SHEET, {}));
  
  // Expanded topics state: { [topicId]: boolean }
  const [expandedTopics, setExpandedTopics] = useState({});

  // Filter/Search query
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL'); // 'ALL' | 'Easy' | 'Medium' | 'Hard'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'SOLVED' | 'UNSOLVED' | 'REVISED'

  // Sync progress to localStorage
  useEffect(() => {
    setStoredData(STORAGE_KEYS.DSA_SHEET, progress);
  }, [progress]);

  // Toggle solved
  const toggleSolved = (problemId) => {
    setProgress(prev => {
      const current = prev[problemId] || { solved: false, revised: false };
      return {
        ...prev,
        [problemId]: {
          ...current,
          solved: !current.solved
        }
      };
    });
  };

  // Toggle revised (strictly separate from solved)
  const toggleRevised = (problemId) => {
    setProgress(prev => {
      const current = prev[problemId] || { solved: false, revised: false };
      return {
        ...prev,
        [problemId]: {
          ...current,
          revised: !current.revised
        }
      };
    });
  };

  // Toggle topic accordion
  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const expandAll = () => {
    const all = {};
    STRIVER_TOPICS.forEach(t => { all[t.id] = true; });
    setExpandedTopics(all);
  };

  const collapseAll = () => {
    setExpandedTopics(Object.fromEntries(STRIVER_TOPICS.map(t => [t.id, false])));
  };

  // Calculate overall metrics
  const totalCatalogueCount = ALL_STRIVER_PROBLEMS.length; // 495
  const solvedCount = useMemo(() => {
    return ALL_STRIVER_PROBLEMS.filter(p => progress[p.id]?.solved).length;
  }, [progress]);

  const revisedCount = useMemo(() => {
    return ALL_STRIVER_PROBLEMS.filter(p => progress[p.id]?.revised).length;
  }, [progress]);

  // Filtered problems checker
  const isProblemMatching = (p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSub = p.subCategory?.toLowerCase().includes(q);
      if (!matchName && !matchSub) return false;
    }
    if (difficultyFilter !== 'ALL' && p.difficulty !== difficultyFilter) {
      return false;
    }
    const userState = progress[p.id] || { solved: false, revised: false };
    if (statusFilter === 'SOLVED' && !userState.solved) return false;
    if (statusFilter === 'UNSOLVED' && userState.solved) return false;
    if (statusFilter === 'REVISED' && !userState.revised) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Optional Back to Dashboard Navigation */}
      {onBack && (
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-semibold transition-all group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Coding Dashboard</span>
          </button>
        </div>
      )}

      <SheetProgress completed={solvedCount} total={totalCatalogueCount} revision={revisedCount}
        topics={STRIVER_TOPICS.length} label="Striver A2Z DSA Tracker" title="Your DSA roadmap"
        description="Build your skills topic by topic. Mark questions complete and bookmark the ones to revisit." />

      {/* Controls Bar: Search, Filters, Expand/Collapse */}
      <div className="glass-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {/* Search box */}
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Search DSA problems"
              placeholder="Search problem name or subtopic..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setExpandedTopics({}); }}
              className="w-full bg-slate-900 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            aria-label="Filter by difficulty"
            value={difficultyFilter}
            onChange={(e) => { setDifficultyFilter(e.target.value); setExpandedTopics({}); }}
            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Filter */}
          <select
            aria-label="Filter by completion status"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setExpandedTopics({}); }}
            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="SOLVED">Solved Only</option>
            <option value="UNSOLVED">Unsolved Only</option>
            <option value="REVISED">Revised Only</option>
          </select>
        </div>

        {/* Global Accordion Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {!ALL_STRIVER_PROBLEMS.some(isProblemMatching) && (
        <div className="glass-panel rounded-2xl p-8 text-center">
          <p className="text-slate-200">No questions match your filters.</p>
          <button className="mt-3 text-indigo-300 underline" onClick={() => { setSearchQuery(''); setDifficultyFilter('ALL'); setStatusFilter('ALL'); }}>Clear filters</button>
        </div>
      )}
      {/* Collapsible Topics Accordion List */}
      <div className="space-y-2.5">
        {STRIVER_TOPICS.map(topic => {
          const isExpanded = Boolean(expandedTopics[topic.id]);
          
          // Calculate topic solved count
          const topicSolvedCount = topic.problems.filter(p => progress[p.id]?.solved).length;
          const topicPercentage = topic.problems.length > 0 
            ? Math.round((topicSolvedCount / topic.problems.length) * 100) 
            : 0;

          // Filter problems for display
          const displayProblems = topic.problems.filter(isProblemMatching);

          // If search/filter is active and no problems match in this topic, don't show the topic header
          if ((searchQuery || difficultyFilter !== 'ALL' || statusFilter !== 'ALL') && displayProblems.length === 0) {
            return null;
          }

          return (
            <div 
              key={topic.id}
              className="glass-panel rounded-xl border border-white/10 overflow-hidden transition-colors"
            >
              {/* Compact Collapsible Topic Row */}
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => toggleTopic(topic.id)}
                className="w-full px-4 py-5 bg-slate-900/60 hover:bg-slate-800/60 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1 rounded text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Step {topic.topicIndex}
                  </span>
                  <span className="font-bold text-sm text-slate-100 truncate">
                    {topic.title}
                  </span>
                </div>

                {/* Topic Progress Metric Badge */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-mono font-medium text-slate-300">
                    {topicSolvedCount} / {topic.problems.length}
                  </span>
                  <div className="w-16 bg-slate-950 rounded-full h-1.5 hidden sm:block border border-white/5 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${topicPercentage}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 min-w-[32px] text-right">
                    {topicPercentage}%
                  </span>
                </div>
              </button>

              {/* Problem Table */}
              {isExpanded && (
                <div className="overflow-x-auto border-t border-white/5">
                  <table className="w-full min-w-[760px] text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 text-slate-400 border-b border-white/10 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3.5 w-14 text-center">Status</th>
                        <th className="py-2.5 px-3">Problem Name</th>
                        <th className="py-2.5 px-3 w-32">Subcategory</th>
                        <th className="py-2.5 px-3 w-28 text-center">Practice</th>
                        <th className="py-2.5 px-3 w-20 text-center">Revision</th>
                        <th className="py-2.5 px-3 w-24 text-center">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {displayProblems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-slate-500 text-xs">
                            No problems matching current filters in this topic.
                          </td>
                        </tr>
                      ) : (
                        displayProblems.map((prob, pIdx) => {
                          const state = progress[prob.id] || { solved: false, revised: false };
                          
                          const diffClass = {
                            Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                            Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                            Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          }[prob.difficulty] || 'text-slate-400 bg-slate-800 border-white/10';

                          return (
                            <tr 
                              key={prob.id}
                              className={`transition-colors ${state.solved ? 'bg-emerald-950/10 hover:bg-emerald-950/20' : 'hover:bg-slate-800/40'}`}
                            >
                              {/* Solved Checkbox */}
                              <td className="py-3 px-4 text-center">
                                <CompletionButton completed={state.solved} onClick={() => toggleSolved(prob.id)} name={prob.name} />
                              </td>

                              {/* Problem Title */}
                              <td className="py-3 px-4 font-medium text-slate-200">
                                <span className={state.solved ? 'text-emerald-200' : ''}>
                                  {prob.name}
                                </span>
                              </td>

                              {/* Subcategory */}
                              <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[130px]">
                                {prob.subCategory}
                              </td>

                              {/* Practice Links (LeetCode / GFG) */}
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {prob.leetcodeUrl ? (
                                    <a
                                      href={prob.leetcodeUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="Open problem on LeetCode"
                                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors inline-flex items-center gap-1 font-mono"
                                    >
                                      <span>LC</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  ) : (
                                    <span className="text-[10px] text-slate-600 font-mono">
                                      -
                                    </span>
                                  )}
                                  {prob.gfgUrl && (
                                    <a
                                      href={prob.gfgUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="Open problem on GeeksforGeeks"
                                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors inline-flex items-center gap-1 font-mono"
                                    >
                                      <span>GFG</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>
                              </td>

                              {/* Revision Checkbox / Star */}
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  aria-pressed={state.revised}
                                  aria-label={`${state.revised ? "Remove revision bookmark" : "Save for revision"}: ${prob.name}`}
                                  onClick={() => toggleRevised(prob.id)}
                                  title={state.revised ? "Remove from revision" : "Mark for revision"}
                                  className="inline-flex items-center justify-center p-3 rounded hover:bg-white/5 transition-colors"
                                >
                                  <Bookmark 
                                    className={`w-4 h-4 transition-colors ${
                                      state.revised 
                                        ? 'text-amber-400 fill-amber-400' 
                                        : 'text-slate-600 hover:text-slate-400'
                                    }`} 
                                  />
                                </button>
                              </td>

                              {/* Difficulty */}
                              <td className="py-3 px-4 text-center">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${diffClass}`}>
                                  {prob.difficulty}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
