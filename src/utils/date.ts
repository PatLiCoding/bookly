export function dateValue(date?: string): number {
  if (!date) return 0;
  const [day, month, year] = date.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
}
