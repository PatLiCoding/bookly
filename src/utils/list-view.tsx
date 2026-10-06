import type { Order } from "../interface/order";
import type { Review } from "../interface/review";
import { matchesQuery } from "./book-search";
import { dateValue } from "./date";

/**
 * Defines the direction for sorting collections ("asc" for ascending, "desc" for descending).
 */
export type SortDirection = "asc" | "desc";

/**
 * Filters a list of customer reviews based on whether the review's book title or author matches a search query.
 *
 * @param reviews - The collection of review items to filter.
 * @param query - The search query string.
 * @returns An array of reviews that match the search query.
 */
export function filterReviews(reviews: Review[], query: string): Review[] {
  return reviews.filter((r) =>
    matchesQuery(`${r.bookTitle} ${r.author}`, query),
  );
}

/**
 * Filters a list of orders to include only those containing at least one item matching the search query.
 * If the query string is empty or contains only whitespace, returns the original orders array.
 *
 * @param orders - The collection of order items to filter.
 * @param query - The search query string.
 * @returns An array of orders where at least one order item matches the query.
 */
export function filterOrders(orders: Order[], query: string): Order[] {
  if (!query.trim()) return orders;
  return orders.filter((o) =>
    o.items.some((i) => matchesQuery(`${i.title} ${i.author}`, query)),
  );
}

/**
 * Sorts an array of items by date in the specified direction.
 * If two items have identical dates, item IDs are used as a secondary tie-breaker.
 *
 * @template T - The type of items being sorted, requiring an `id` property.
 * @param items - The array of items to sort.
 * @param getDate - A accessor function returning the date string ("DD.MM.YYYY") for an item.
 * @param direction - The sorting order: "asc" for ascending or "desc" for descending.
 * @returns A new sorted array of items without modifying the original array.
 */
export function sortByDate<T extends { id: number }>(
  items: T[],
  getDate: (item: T) => string,
  direction: SortDirection,
): T[] {
  const factor = direction === "asc" ? 1 : -1;
  return [...items].sort(
    (a, b) =>
      factor * (dateValue(getDate(a)) - dateValue(getDate(b)) || a.id - b.id),
  );
}
