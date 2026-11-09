/**
 * Coding Platform API service for LeetCode & Codeforces.
 * Fetches real statistics and rating histories.
 * Never fabricates numbers.
 */

// Format timestamp to short readable date: "Jan 2024" or "15 Mar 24"
export function formatContestDate(epochSeconds) {
  if (!epochSeconds) return '';
  const date = new Date(epochSeconds * 1000);
  return date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric',
    year: '2-digit'
  });
}

/**
 * Fetch Codeforces statistics and contest rating history.
 * Codeforces API docs: https://codeforces.com/apiHelp
 */
export async function fetchCodeforcesStats(handle) {
  if (!handle || !handle.trim()) {
    return { error: 'No handle provided', configured: false };
  }

  const cleanHandle = handle.trim();
  const result = {
    handle: cleanHandle,
    totalSolved: null,
    currentRating: null,
    highestRating: null,
    rank: null,
    maxRank: null,
    ratingHistory: [],
    lastUpdated: new Date().toISOString(),
    error: null,
    configured: true
  };

  try {
    // 1. Fetch user info (current & max rating)
    const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(cleanHandle)}`);
    if (!userRes.ok) {
      throw new Error(`Codeforces user request failed with HTTP ${userRes.status}`);
    }
    const userData = await userRes.json();
    if (userData.status !== 'OK' || !userData.result || !userData.result[0]) {
      throw new Error(userData.comment || 'Codeforces user not found');
    }

    const userInfo = userData.result[0];
    result.currentRating = typeof userInfo.rating === 'number' ? userInfo.rating : null;
    result.highestRating = typeof userInfo.maxRating === 'number' ? userInfo.maxRating : null;
    result.rank = userInfo.rank || null;
    result.maxRank = userInfo.maxRank || null;

    // 2. Fetch rating history
    try {
      const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(cleanHandle)}`);
      if (ratingRes.ok) {
        const ratingData = await ratingRes.json();
        if (ratingData.status === 'OK' && Array.isArray(ratingData.result)) {
          result.ratingHistory = ratingData.result.map(item => ({
            contestId: item.contestId,
            contestName: item.contestName,
            rating: item.newRating,
            oldRating: item.oldRating,
            rank: item.rank,
            timestamp: item.ratingUpdateTimeSeconds,
            date: formatContestDate(item.ratingUpdateTimeSeconds)
          }));
        }
      }
    } catch (e) {
      console.warn('Could not fetch CF rating history:', e);
    }

    // 3. Fetch user submissions to calculate distinct solved problems
    try {
      const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(cleanHandle)}&from=1&count=10000`);
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.status === 'OK' && Array.isArray(statusData.result)) {
          const solvedSet = new Set();
          statusData.result.forEach(sub => {
            if (sub.verdict === 'OK' && sub.problem) {
              const problemKey = `${sub.problem.contestId || ''}-${sub.problem.index || sub.problem.name}`;
              solvedSet.add(problemKey);
            }
          });
          result.totalSolved = solvedSet.size;
        }
      }
    } catch (e) {
      console.warn('Could not fetch CF problem status:', e);
    }

    return result;
  } catch (err) {
    return {
      ...result,
      error: err.message || 'Failed to fetch Codeforces data'
    };
  }
}

export async function fetchLeetCodeStats(handle, signal) {
  try {
    const response = await fetch('/api/leetcode-profile?username=' + encodeURIComponent(handle), { signal });
    const body = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(body?.ratingHistory)) {
      throw new Error(body?.error || 'The SmartStudy profile service is unavailable. Please retry.');
    }
    return { ...body, ratingHistory: body.ratingHistory.map(point => ({
      ...point, date: formatContestDate(point.timestamp)
    })) };
  } catch (error) {
    return { handle, error: error instanceof TypeError ? 'Could not reach SmartStudy. Check your connection and retry.' : error.message };
  }
}
