import type { Order } from "../interface/order";
import type { Review } from "../interface/review";
import { matchesQuery } from "./book-search";
import { dateValue } from "./date";

export type SortDirection = "asc" | "desc";

export function filterReviews(reviews: Review[], query: string): Review[] {
  return reviews.filter((r) =>
    matchesQuery(`${r.bookTitle} ${r.author}`, query),
  );
}

export function filterOrders(orders: Order[], query: string): Order[] {
  if (!query.trim()) return orders;
  return orders.filter((o) =>
    o.items.some((i) => matchesQuery(`${i.title} ${i.author}`, query)),
  );
}

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
