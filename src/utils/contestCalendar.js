export const IST = 'Asia/Kolkata';
const dayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: IST, year: 'numeric', month: '2-digit', day: '2-digit' });
export function istDay(epochMs) {
  return dayFormatter.format(new Date(epochMs));
}
export function calendarDays(year, month) {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(Date.UTC(year, month, 1 - offset + i));
    return { key: date.toISOString().slice(0, 10), day: date.getUTCDate(), current: date.getUTCMonth() === month };
  });
}
export function normalizeContests(cf = [], lc = []) {
  const records = [
    ...cf.filter(c => Number.isFinite(c.startTimeSeconds)).map(c => ({ id: `cf-${c.id}`, platform: 'Codeforces', title: c.name, start: c.startTimeSeconds * 1000, duration: c.durationSeconds, url: `https://codeforces.com/contest/${c.id}` })),
    ...lc.filter(c => Number.isFinite(c.startTime) && c.titleSlug).map(c => ({ id: `lc-${c.titleSlug}`, platform: 'LeetCode', title: c.title, start: c.startTime * 1000, duration: c.duration, url: `https://leetcode.com/contest/${encodeURIComponent(c.titleSlug)}/` }))
  ];
  return [...new Map(records.map(c => [c.id, c])).values()].sort((a, b) => a.start - b.start);
}

// Fill the visible calendar with the user's requested recurrence. Published
// records win, including rescheduled contests with the same contest number.
export function withLeetcodeRecurrence(events, year, month) {
  const days = calendarDays(year, month);
  const start = Date.parse(`${days[0].key}T00:00:00Z`);
  const end = Date.parse(`${days.at(-1).key}T23:59:59Z`);
  const result = [...events];
  const series = [
    { kind: 'weekly', label: 'Weekly Contest', anchor: Date.parse('2026-11-08T02:30:00Z'), number: 527, period: 7 * 86400000 },
    { kind: 'biweekly', label: 'Biweekly Contest', anchor: Date.parse('2026-11-07T14:30:00Z'), number: 195, period: 14 * 86400000 },
  ];
  for (const schedule of series) {
    for (let n = Math.ceil((start - schedule.anchor) / schedule.period); schedule.anchor + n * schedule.period <= end; n++) {
      const time = schedule.anchor + n * schedule.period;
      const number = schedule.number + n;
      if (number < 1) continue;
      const slug = `${schedule.kind}-contest-${number}`;
      const published = events.some(c => c.platform === 'LeetCode' &&
        (c.id === `lc-${slug}` || (istDay(c.start) === istDay(time) && c.title.toLowerCase().startsWith(`${schedule.kind} contest`))));
      if (published) continue;
      result.push({ id: `lc-expected-${slug}`, platform: 'LeetCode', title: `${schedule.label} ${number}`, start: time, duration: 5400, url: 'https://leetcode.com/contest/', expected: true });
    }
  }
  return result.sort((a, b) => a.start - b.start);
}
async function jsonRequest(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
export async function fetchContestSchedules() {
  const [cf, lc] = await Promise.allSettled([
    jsonRequest('https://codeforces.com/api/contest.list?gym=false').then(data => {
      if (data.status !== 'OK' || !Array.isArray(data.result)) throw new Error('Invalid Codeforces response');
      return data.result.filter(c => c.startTimeSeconds * 1000 > Date.now() - 366 * 86400000);
    }),
    jsonRequest('/api/leetcode/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: '{ topTwoContests { title titleSlug startTime duration } pastContests(pageNo: 1, numPerPage: 50) { data { title titleSlug startTime duration } } }' }) }).then(data => {
      if (data.errors?.length || !Array.isArray(data.data?.topTwoContests) || !Array.isArray(data.data?.pastContests?.data)) throw new Error('Invalid LeetCode response');
      return [...data.data.topTwoContests, ...data.data.pastContests.data];
    })
  ]);
  return { cf, lc };
}
