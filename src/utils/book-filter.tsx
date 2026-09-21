import type { Book } from "../interface/book";

export type SortOption = "price-asc" | "price-desc";

export interface Filters {
  minRating: number | null;
  sort: SortOption | null;
}

/** Default state: no filter and no sorting active. */
export const NO_FILTERS: Filters = { minRating: null, sort: null };

/** Converts a price string like "14,99 €" into a number (14.99). */
export function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^\d,]/g, "").replace(",", "."));
}

/** Keeps only books with at least the given rating (null = no filter). */
function filterByRating(books: Book[], minRating: number | null): Book[] {
  if (minRating === null) return books;
  return books.filter((book) => book.rating >= minRating);
}

/** Sorts a copy of the books by price (null = keep original order). */
function sortByPrice(books: Book[], sort: SortOption | null): Book[] {
  if (sort === null) return books;
  const direction = sort === "price-asc" ? 1 : -1;
  return [...books].sort(
    (a, b) => direction * (parsePrice(a.price) - parsePrice(b.price))
  );
}

/** Applies all active filters and the active sorting to the given books. */
export function applyFilters(books: Book[], filters: Filters): Book[] {
  return sortByPrice(filterByRating(books, filters.minRating), filters.sort);
}
