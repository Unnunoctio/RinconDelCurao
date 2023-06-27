export const verifyRanges = (range1, range2) => {
  if (!range1 || !range2) return false

  return range1[0] < range2[0] || range1[1] > range2[1]
}
