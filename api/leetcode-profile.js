const profileQuery = `query SmartStudyProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
  userContestRanking(username: $username) { rating }
  userContestRankingHistory(username: $username) {
    attended rating ranking contest { title startTime }
  }
}`;

function reply(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', status === 200 ? 'public, max-age=0, s-maxage=300' : 'no-store');
  res.end(JSON.stringify(body));
}

export default async function profile(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return reply(res, 405, { error: 'Use GET to request a profile.' });
  }
  const handle = new URL(req.url, 'http://localhost').searchParams.get('username')?.trim();
  if (!handle || !/^[\w.-]{1,100}$/.test(handle)) {
    return reply(res, 400, { error: 'Enter your LeetCode username in Settings.' });
  }
  const endpoint = new URL('https://leetcode.com/graphql/');
  endpoint.searchParams.set('query', profileQuery);
  endpoint.searchParams.set('variables', JSON.stringify({ username: handle }));
  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000)
    });
    if (response.status === 429) {
      res.setHeader('Retry-After', response.headers.get('Retry-After') || '60');
      return reply(res, 429, { error: 'LeetCode is rate limiting requests. Please try again later.' });
    }
    if (!response.ok) throw new Error('Upstream HTTP error');
    const { data, errors } = await response.json();
    if (errors?.some(error => error.path?.[0] === 'matchedUser' && /does not exist|not found/i.test(error.message)) ||
        (!errors?.length && data?.matchedUser === null)) {
      return reply(res, 404, { error: 'LeetCode could not find this username. Check your handle in Settings.' });
    }
    const totalSolved = data?.matchedUser?.submitStatsGlobal?.acSubmissionNum?.find(row => row.difficulty === 'All')?.count;
    const history = data?.userContestRankingHistory;
    if (errors?.length || !Number.isInteger(totalSolved) || totalSolved < 0 ||
        !(Array.isArray(history) || (history === null && data.userContestRanking === null))) {
      throw new Error('Incomplete profile');
    }
    const ratingHistory = (history || []).filter(row => row.attended && row.rating > 0).map(row => {
      if (!Number.isFinite(row.rating) || !(row.contest?.startTime > 0)) throw new Error('Incomplete contest');
      return { contestTitle: row.contest.title, timestamp: row.contest.startTime, rating: Math.round(row.rating), rank: row.ranking };
    }).sort((a, b) => a.timestamp - b.timestamp);
    const rating = data.userContestRanking?.rating;
    const currentRating = Number.isFinite(rating) ? Math.round(rating) : ratingHistory.at(-1)?.rating ?? null;
    const highestRating = ratingHistory.reduce((peak, entry) => Math.max(peak ?? entry.rating, entry.rating), currentRating);
    return reply(res, 200, { handle, totalSolved, currentRating, highestRating, ratingHistory, lastUpdated: new Date().toISOString() });
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return reply(res, 504, { error: 'LeetCode took too long to respond. Please retry.' });
    }
    return reply(res, 502, { error: 'LeetCode could not return a complete profile. Please retry.' });
  }
}
