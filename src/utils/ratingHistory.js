// Works with existing cached history as well as fresh API responses.
export function withRatingChanges(history = []) {
  const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);
  return sorted.map((entry, index) => {
    const previous = Number.isFinite(entry.oldRating) ? entry.oldRating : sorted[index - 1]?.rating;
    return { ...entry, ratingChange: Number.isFinite(previous) && Number.isFinite(entry.rating) ? Math.round(entry.rating) - Math.round(previous) : null };
  });
}
