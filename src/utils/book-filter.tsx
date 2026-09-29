import type { Book } from "../interface/book";
import { dateValue } from "./date";

export type SortOption =
  | "rating"
  | "reviews"
  | "newest"
  | "price-asc"
  | "price-desc";

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

/** Newer release date first (books without a date come last). */
const byNewest = (a: Book, b: Book) =>
  dateValue(b.releaseDate) - dateValue(a.releaseDate);

/** One comparator per sort option; ties are broken by a second criterion. */
const COMPARATORS: Record<SortOption, (a: Book, b: Book) => number> = {
  rating: (a, b) => b.rating - a.rating || byNewest(a, b),
  reviews: (a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating,
  newest: byNewest,
  "price-asc": (a, b) => parsePrice(a.price) - parsePrice(b.price),
  "price-desc": (a, b) => parsePrice(b.price) - parsePrice(a.price),
};

/** Keeps only books with at least the given rating (null = no filter). */
function filterByRating(books: Book[], minRating: number | null): Book[] {
  if (minRating === null) return books;
  return books.filter((book) => book.rating >= minRating);
}

/** Sorts a copy of the books (null = keep original order). */
export function sortBooks(books: Book[], sort: SortOption | null): Book[] {
  if (sort === null) return books;
  return [...books].sort(COMPARATORS[sort]);
}

/** Turns a URL value like "rating" into a SortOption (null if unknown). */
export function parseSort(value: string | null): SortOption | null {
  if (value === null || !Object.keys(COMPARATORS).includes(value)) return null;
  return value as SortOption;
}

/** Number of active filters (rating filter and sorting count one each). */
export function countActiveFilters(filters: Filters): number {
  return Number(filters.minRating !== null) + Number(filters.sort !== null);
}

/** Applies all active filters and the active sorting to the given books. */
export function applyFilters(books: Book[], filters: Filters): Book[] {
  return sortBooks(filterByRating(books, filters.minRating), filters.sort);
}