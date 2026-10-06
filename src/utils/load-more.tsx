/**
 * Returns the first `count` items from a list, typically used for incrementally
 * loading content (e.g., "Load More" functionality).
 *
 * @template T - The type of elements in the array.
 * @param items - The complete array of items.
 * @param count - The number of items to make visible.
 * @returns A sliced array containing up to `count` items.
 */
export function visibleItems<T>(items: T[], count: number): T[] {
  return items.slice(0, count);
}

/**
 * Checks whether additional items exist in the list beyond the currently visible count.
 *
 * @template T - The type of elements in the array.
 * @param items - The complete array of items.
 * @param count - The current count of visible items.
 * @returns `true` if there are remaining unrendered items, otherwise `false`.
 */
export function hasMoreItems<T>(items: T[], count: number): boolean {
  return count < items.length;
}