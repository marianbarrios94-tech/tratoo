export function starString(rating: number, max = 5) {
  const filled = Math.round(Math.min(Math.max(rating, 0), max))
  return '★'.repeat(filled) + '☆'.repeat(max - filled)
}
