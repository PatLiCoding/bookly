/** First `count` items of a list — for incrementally growing "Mehr laden" */
export function visibleItems<T>(items: T[], count: number): T[] {
  return items.slice(0, count);
}

/** Whether more items exist beyond the currently visible count. */
export function hasMoreItems<T>(items: T[], count: number): boolean {
  return count < items.length;
}