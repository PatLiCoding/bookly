/**
 * Converts a German date string formatted as "DD.MM.YYYY" into a timestamp (milliseconds since Unix epoch).
 * Returns `0` if the date string is omitted or falsy.
 *
 * @param date - The optional date string in "DD.MM.YYYY" format (e.g., "15.08.2024").
 * @returns The timestamp in milliseconds, or `0` if the date string is undefined/empty.
 */
export function dateValue(date?: string): number {
  if (!date) return 0;
  const [day, month, year] = date.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
}
