export function getLineNumberFromPosition(
  text: string,
  position: number,
): number {
  // Split the text into lines
  const lines = text.substring(0, position).split("\n")

  // The number of lines is equal to the length of the array of lines
  return lines.length
}
