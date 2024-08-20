export function getPosOfNthOccurrence(
  str: string,
  subStr: string,
  n: number,
): number | null {
  let index = -1

  for (let i = 0; i < n; i++) {
    index = str.indexOf(subStr, index + 1)

    if (index === -1) {
      return null // Return null if the nth occurrence doesn't exist
    }
  }

  return index
}
