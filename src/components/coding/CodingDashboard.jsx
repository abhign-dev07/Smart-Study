import React from 'react';
import ContestCalendar from './ContestCalendar';
import { withRatingChanges } from '../../utils/ratingHistory';
import { 
  CheckSquare, Sparkles, TrendingUp, ArrowRight, 
  RefreshCw, Settings, ExternalLink, AlertCircle, Award, 
  HelpCircle, BarChart3, Database 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid 
} from 'recharts';

/**
 * Custom dark tooltip for rating graphs
 */
function RatingTooltip({ active, payload, platformName }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-white/10 p-2.5 rounded-xl shadow-xl text-xs backdrop-blur-md">
        <div className="font-semibold text-white mb-1">
          {data.contestName || data.contestTitle || `${platformName} Contest`}
        </div>
        <div className="text-slate-400 text-[11px] mb-1.5">{data.date}</div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Rating:</span>
          <span className="font-mono font-bold text-white text-sm">{data.rating}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-slate-400">Change:</span>
          <span className={`font-mono font-bold ${data.ratingChange > 0 ? 'text-emerald-400' : data.ratingChange < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {data.ratingChange == null ? 'N/A (first contest)' : `${data.ratingChange > 0 ? '+' : ''}${data.ratingChange}`}
          </span>
        </div>
        {data.rank && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
            <span>Rank:</span>
            <span className="font-mono text-slate-200">#{data.rank}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function CodingDashboard({
  settings,
  leetcodeData,
  codeforcesData,
  isLoading,
  lastSynced,
  onRefresh,
  onOpenSettings,
  onOpenDsaSheet,
  onOpenCpSheet,
  onOpenCp31,
  dsaSolvedCount = 0,
  cpSolvedCount = 0,
  cpTotalCount = 0,
  dsaTotalCount = 495
}) {
  const hasLeetcodeConfigured = Boolean(settings?.leetcodeHandle?.trim());
  const hasCodeforcesConfigured = Boolean(settings?.codeforcesHandle?.trim());

  return (
    <div className="space-y-8">
      {/* Top Header / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Coding Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time platform statistics, contest rating progression, and practice sheet navigators.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {lastSynced && (
            <span className="text-[11px] text-slate-400 hidden md:inline font-mono mr-2">
              Synced: {lastSynced}
            </span>
          )}
          <button
            onClick={onOpenSettings}
            className="px-3 py-2 bg-slate-900 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Configure Handles</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading || (!hasLeetcodeConfigured && !hasCodeforcesConfigured)}
            className={`px-3.5 py-2 bg-slate-900 border border-white/10 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm ${
              isLoading || (!hasLeetcodeConfigured && !hasCodeforcesConfigured)
                ? 'text-slate-500 cursor-not-allowed border-white/5'
                : 'text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 active:scale-95'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Fetching Data...' : 'Refresh Stats'}</span>
          </button>
        </div>
      </div>

      {/* 2. Platform Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LeetCode Summary Card */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-amber-500/20 flex flex-col justify-between space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 text-base">
                LC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">LeetCode</h3>
                  {hasLeetcodeConfigured && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Verified
                    </span>
                  )}
                </div>
                {hasLeetcodeConfigured ? (
                  <a
                    href={`https://leetcode.com/${settings.leetcodeHandle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-400/90 hover:text-amber-300 hover:underline flex items-center gap-1 font-mono mt-0.5"
                  >
                    @{settings.leetcodeHandle} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">Profile not configured</p>
                )}
              </div>
            </div>

            {hasLeetcodeConfigured && leetcodeData?.globalRanking && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Global Rank</span>
                <span className="text-xs font-mono font-bold text-slate-200">#{leetcodeData.globalRanking.toLocaleString()}</span>
              </div>
            )}
          </div>

          {!hasLeetcodeConfigured ? (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-dashed border-white/10 text-center space-y-2">
              <p className="text-xs text-slate-400">
                LeetCode profile is not configured. Configure your handle to view real solved counts and contest rating.
              </p>
              <button
                onClick={onOpenSettings}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
              >
                Configure LeetCode Handle
              </button>
            </div>
          ) : leetcodeData?.error ? (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-200">Unable to fetch LeetCode data</p>
                <p className="text-slate-400 text-[11px] mt-0.5">{leetcodeData.error}</p>
                <button
                  onClick={onRefresh}
                  className="mt-2 text-[11px] text-amber-400 hover:underline font-semibold"
                >
                  Retry Fetch
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 pt-1">
              {/* Total Problems Solved */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Problems Solved</span>
                <span className="text-xl font-bold font-mono text-white mt-1 block">
                  {leetcodeData?.totalSolved !== null && leetcodeData?.totalSolved !== undefined
                    ? leetcodeData.totalSolved
                    : '—'}
                </span>
                {leetcodeData?.easySolved !== null && leetcodeData?.easySolved !== undefined && (
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {leetcodeData.easySolved}E • {leetcodeData.mediumSolved}M • {leetcodeData.hardSolved}H
                  </span>
                )}
              </div>

              {/* Current Contest Rating */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Current Rating</span>
                <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                  {leetcodeData?.currentRating !== null && leetcodeData?.currentRating !== undefined
                    ? leetcodeData.currentRating
                    : 'Unrated'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {leetcodeData?.attendedContestsCount || 0} Contests
                </span>
              </div>

              {/* Highest Contest Rating */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Highest Rating</span>
                <span className="text-xl font-bold font-mono text-amber-300 mt-1 block">
                  {leetcodeData?.highestRating !== null && leetcodeData?.highestRating !== undefined
                    ? leetcodeData.highestRating
                    : (leetcodeData?.currentRating ? leetcodeData.currentRating : '—')}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Peak rating</span>
              </div>
            </div>
          )}
        </div>

        {/* Codeforces Summary Card */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-cyan-500/20 flex flex-col justify-between space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-base">
                CF
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Codeforces</h3>
                  {hasCodeforcesConfigured && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Verified
                    </span>
                  )}
                </div>
                {hasCodeforcesConfigured ? (
                  <a
                    href={`https://codeforces.com/profile/${settings.codeforcesHandle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400/90 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono mt-0.5"
                  >
                    @{settings.codeforcesHandle} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">Profile not configured</p>
                )}
              </div>
            </div>

            {hasCodeforcesConfigured && codeforcesData?.rank && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Rank</span>
                <span className="text-xs font-semibold capitalize text-cyan-300">{codeforcesData.rank}</span>
              </div>
            )}
          </div>

          {!hasCodeforcesConfigured ? (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-dashed border-white/10 text-center space-y-2">
              <p className="text-xs text-slate-400">
                Codeforces profile is not configured. Configure your handle to view verified rating and solved counts.
              </p>
              <button
                onClick={onOpenSettings}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4"
              >
                Configure Codeforces Handle
              </button>
            </div>
          ) : codeforcesData?.error ? (
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-cyan-200">Unable to fetch Codeforces data</p>
                <p className="text-slate-400 text-[11px] mt-0.5">{codeforcesData.error}</p>
                <button
                  onClick={onRefresh}
                  className="mt-2 text-[11px] text-cyan-400 hover:underline font-semibold"
                >
                  Retry Fetch
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 pt-1">
              {/* Total Problems Solved */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Problems Solved</span>
                <span className="text-xl font-bold font-mono text-white mt-1 block">
                  {codeforcesData?.totalSolved !== null && codeforcesData?.totalSolved !== undefined
                    ? codeforcesData.totalSolved
                    : '—'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Distinct ACs</span>
              </div>

              {/* Current Rating */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Current Rating</span>
                <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
                  {codeforcesData?.currentRating !== null && codeforcesData?.currentRating !== undefined
                    ? codeforcesData.currentRating
                    : 'Unrated'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {codeforcesData?.rank || 'Active user'}
                </span>
              </div>

              {/* Highest Rating */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Highest Rating</span>
                <span className="text-xl font-bold font-mono text-cyan-300 mt-1 block">
                  {codeforcesData?.highestRating !== null && codeforcesData?.highestRating !== undefined
                    ? codeforcesData.highestRating
                    : (codeforcesData?.currentRating ? codeforcesData.currentRating : '—')}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {codeforcesData?.maxRank ? `Peak: ${codeforcesData.maxRank}` : 'Peak rating'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Rating Progress Graphs (Separate) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LeetCode Rating Progression */}
        <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">LeetCode Rating History</h3>
            </div>
            {leetcodeData?.ratingHistory && leetcodeData.ratingHistory.length > 0 && (
              <span className="text-[11px] font-mono text-amber-400 font-semibold">
                {leetcodeData.ratingHistory.length} Contests
              </span>
            )}
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {!hasLeetcodeConfigured ? (
              <div className="text-center p-6 space-y-1.5">
                <BarChart3 className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">LeetCode profile not configured</p>
                <p className="text-[11px] text-slate-500">Configure your handle to see your contest rating history.</p>
              </div>
            ) : leetcodeData?.ratingHistory && leetcodeData.ratingHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={withRatingChanges(leetcodeData.ratingHistory)}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="lcRatingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    domain={['dataMin - 50', 'dataMax + 50']}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <Tooltip content={<RatingTooltip platformName="LeetCode" />} />
                  <Area
                    type="monotone"
                    dataKey="rating"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#lcRatingGrad)"
                    dot={{ fill: '#f59e0b', r: 2 }}
                    activeDot={{ r: 5, fill: '#fbbf24', stroke: '#0B0F19', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-6 space-y-1.5">
                <TrendingUp className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">No contest history found</p>
                <p className="text-[11px] text-slate-500">
                  Participate in LeetCode Weekly/Biweekly Contests to track your rating progression.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Codeforces Rating Progression */}
        <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Codeforces Rating History</h3>
            </div>
            {codeforcesData?.ratingHistory && codeforcesData.ratingHistory.length > 0 && (
              <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                {codeforcesData.ratingHistory.length} Contests
              </span>
            )}
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {!hasCodeforcesConfigured ? (
              <div className="text-center p-6 space-y-1.5">
                <BarChart3 className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">Codeforces profile not configured</p>
                <p className="text-[11px] text-slate-500">Configure your handle to see your contest rating history.</p>
              </div>
            ) : codeforcesData?.ratingHistory && codeforcesData.ratingHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={withRatingChanges(codeforcesData.ratingHistory)}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="cfRatingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    domain={['dataMin - 50', 'dataMax + 50']}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <Tooltip content={<RatingTooltip platformName="Codeforces" />} />
                  <Area
                    type="monotone"
                    dataKey="rating"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#cfRatingGrad)"
                    dot={{ fill: '#06b6d4', r: 2 }}
                    activeDot={{ r: 5, fill: '#22d3ee', stroke: '#0B0F19', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-6 space-y-1.5">
                <TrendingUp className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">No contest history found</p>
                <p className="text-[11px] text-slate-500">
                  Participate in Codeforces rated rounds to record your rating progression over time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Large Visually Distinct Clickable Sheet Cards */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Practice & Track Sheets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: DSA Sheet */}
          <div
            onClick={onOpenDsaSheet}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenDsaSheet(); }}
            className="group relative p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/30 border border-white/10 hover:border-indigo-500/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg shadow-indigo-500/20">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold group-hover:text-indigo-300 transition-colors">
                <span>Open Sheet</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            <div className="mt-5 space-y-1.5">
              <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
                DSA Sheet
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track your Data Structures and Algorithms practice.
              </p>
            </div>

            {/* Completion Progress Preview */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Completion</span>
              <span className="font-mono font-bold text-indigo-400">
                {dsaSolvedCount} / {dsaTotalCount} Solved ({Math.round((dsaSolvedCount / (dsaTotalCount || 1)) * 100)}%)
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (dsaSolvedCount / (dsaTotalCount || 1)) * 100)}%` }}
              />
            </div>
          </div>

          <button type="button" onClick={onOpenCp31} className="group p-7 rounded-3xl bg-gradient-to-br from-slate-900 to-violet-950/30 border border-violet-400/20 hover:border-violet-400/60 text-left transition-colors">
            <div className="flex justify-between text-violet-300"><Sparkles size={28} /><span className="text-xs font-semibold">Open Sheet →</span></div>
            <h3 className="mt-5 text-xl font-extrabold">CP-31 · TLE Eliminators</h3>
            <p className="mt-2 text-sm text-slate-400">31 handpicked problems at each rating. Build your way from 800 to 1900.</p>
            <p className="mt-6 border-t border-white/10 pt-4 text-sm text-violet-300">372 questions · 12 rating groups</p>
          </button>
          {/* Card 2: CP Sheet */}
          <div
            onClick={onOpenCpSheet}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenCpSheet(); }}
            className="group relative p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/30 border border-white/10 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
                <span>Open Sheet</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            <div className="mt-5 space-y-1.5">
              <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                CP Sheet
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track your Competitive Programming practice.
              </p>
            </div>

            {/* Destination Preview */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Completion</span>
              <span className="font-mono text-cyan-400 font-semibold">
                {cpSolvedCount} / {cpTotalCount} Completed
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-white/5">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all" style={{ width: `${cpTotalCount ? cpSolvedCount / cpTotalCount * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      </div>
      <ContestCalendar />
    </div>
  );
}

