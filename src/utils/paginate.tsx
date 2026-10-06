/**
 * Calculates the total number of pages required to display a total number of items,
 * given a specific page size. Always returns at least 1 page even if total is 0.
 *
 * @param total - The total number of items across all pages.
 * @param pageSize - The maximum number of items allowed per page.
 * @returns The calculated total number of pages (minimum of 1).
 */
export function getPageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/**
 * Extracts a subset of items belonging to a specific 1-indexed page.
 *
 * @template T - The type of elements in the array.
 * @param items - The full list of items to paginate.
 * @param page - The 1-based page index to retrieve.
 * @param pageSize - The number of items per page.
 * @returns An array containing only the items corresponding to the specified page.
 */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
