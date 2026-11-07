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

/**
 * Fetch LeetCode statistics and contest rating history.
 * Uses the local Vite proxy (/api/leetcode/graphql) to bypass browser CORS securely.
 * Falls back to public proxies if unavailable.
 */
export async function fetchLeetCodeStats(handle) {
  if (!handle || !handle.trim()) {
    return { error: 'No handle provided', configured: false };
  }

  const cleanHandle = handle.trim();
  const result = {
    handle: cleanHandle,
    totalSolved: null,
    easySolved: null,
    mediumSolved: null,
    hardSolved: null,
    currentRating: null,
    highestRating: null,
    globalRanking: null,
    attendedContestsCount: 0,
    ratingHistory: [],
    lastUpdated: new Date().toISOString(),
    error: null,
    configured: true
  };

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
      userContestRankingHistory(username: $username) {
        attended
        rating
        ranking
        contest {
          title
          startTime
        }
      }
    }
  `;

  // Endpoint candidates: local Vite proxy first
  const endpoints = [
    '/api/leetcode/graphql',
    'https://leetcode.com/graphql'
  ];

  let rawData = null;
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: { username: cleanHandle }
        })
      });

      if (!res.ok) continue;

      const json = await res.json();
      if (json && (json.data?.matchedUser || json.data?.userContestRanking !== undefined)) {
        rawData = json.data;
        break;
      }
      if (json.errors && json.errors.length > 0) {
        lastError = json.errors[0]?.message || 'GraphQL error';
      }
    } catch (e) {
      lastError = e.message;
    }
  }

  if (!rawData || !rawData.matchedUser) {
    return {
      ...result,
      error: lastError || 'User not found on LeetCode'
    };
  }

  // Parse solved problem counts
  const acList = rawData.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
  acList.forEach(item => {
    if (item.difficulty === 'All') result.totalSolved = item.count;
    if (item.difficulty === 'Easy') result.easySolved = item.count;
    if (item.difficulty === 'Medium') result.mediumSolved = item.count;
    if (item.difficulty === 'Hard') result.hardSolved = item.count;
  });

  // Parse contest rating
  if (rawData.userContestRanking) {
    result.currentRating = Math.round(rawData.userContestRanking.rating);
    result.attendedContestsCount = rawData.userContestRanking.attendedContestsCount || 0;
    result.globalRanking = rawData.userContestRanking.globalRanking || null;
  }

  // Parse contest history
  if (Array.isArray(rawData.userContestRankingHistory)) {
    const attended = rawData.userContestRankingHistory
      .filter(item => item.attended && item.rating > 0)
      .map(item => ({
        contestTitle: item.contest?.title || 'Contest',
        rating: Math.round(item.rating),
        rank: item.ranking || null,
        timestamp: item.contest?.startTime || 0,
        date: formatContestDate(item.contest?.startTime)
      }));

    result.ratingHistory = attended;

    if (attended.length > 0) {
      const maxRating = Math.max(...attended.map(item => item.rating));
      result.highestRating = maxRating;
      if (!result.currentRating && attended.length > 0) {
        result.currentRating = attended[attended.length - 1].rating;
      }
    }
  }

  return result;
}

