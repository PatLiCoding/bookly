import type { Book } from "../interface/book";
import { dateValue } from "./date";

/**
 * Available options for sorting book lists.
 */
export type SortOption =
  | "rating"
  | "reviews"
  | "newest"
  | "price-asc"
  | "price-desc";

/**
 * Filter configuration state for filtering and sorting books.
 */
export interface Filters {
  /** Minimum rating threshold, or null if no rating filter is applied. */
  minRating: number | null;
  /** Selected sorting criteria, or null if default ordering is maintained. */
  sort: SortOption | null;
}

/** Default state representing no active filters or sorting rules. */
export const NO_FILTERS: Filters = { minRating: null, sort: null };

/**
 * Converts a formatted price string (e.g. "14,99 €") into a numeric floating-point value (14.99).
 *
 * @param price - The formatted price string containing currency symbols and comma separators.
 * @returns The parsed numeric value of the price.
 */
export function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^\d,]/g, "").replace(",", "."));
}

/**
 * Comparator helper function that sorts books by newest release date first.
 * Books without a valid release date are placed at the end.
 *
 * @param a - The first book to compare.
 * @param b - The second book to compare.
 * @returns A negative value if `b` is newer, positive if `a` is newer, or 0 if equal.
 */
const byNewest = (a: Book, b: Book) =>
  dateValue(b.releaseDate) - dateValue(a.releaseDate);

/**
 * Mapping of sort options to their respective comparator functions.
 * Secondary criteria are used as tie-breakers when primary comparisons evaluate to equality.
 */
const COMPARATORS: Record<SortOption, (a: Book, b: Book) => number> = {
  rating: (a, b) => b.rating - a.rating || byNewest(a, b),
  reviews: (a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating,
  newest: byNewest,
  "price-asc": (a, b) => parsePrice(a.price) - parsePrice(b.price),
  "price-desc": (a, b) => parsePrice(b.price) - parsePrice(a.price),
};

/**
 * Filters an array of books to include only those with a rating greater than or equal to `minRating`.
 *
 * @param books - The list of books to filter.
 * @param minRating - The minimum required rating, or null to bypass filtering.
 * @returns A filtered array of books.
 */
function filterByRating(books: Book[], minRating: number | null): Book[] {
  if (minRating === null) return books;
  return books.filter((book) => book.rating >= minRating);
}

/**
 * Sorts a copy of the provided books array based on the specified sort option.
 * Returns the original array unmodified if sort option is `null`.
 *
 * @param books - The list of books to sort.
 * @param sort - The sort criteria to apply, or null to keep original order.
 * @returns A new sorted array of books.
 */
export function sortBooks(books: Book[], sort: SortOption | null): Book[] {
  if (sort === null) return books;
  return [...books].sort(COMPARATORS[sort]);
}

/**
 * Parses and validates a URL or string parameter into a valid `SortOption`.
 *
 * @param value - The raw string value to parse (e.g. from query parameters).
 * @returns The matched `SortOption`, or `null` if the value is invalid or null.
 */
export function parseSort(value: string | null): SortOption | null {
  if (value === null || !Object.keys(COMPARATORS).includes(value)) return null;
  return value as SortOption;
}

/**
 * Counts the total number of active filters (rating filter and sort option each count as 1).
 *
 * @param filters - The current active filter state.
 * @returns The total count of active filter settings.
 */
export function countActiveFilters(filters: Filters): number {
  return Number(filters.minRating !== null) + Number(filters.sort !== null);
}

/**
 * Applies both active rating criteria and sorting rules to an array of books.
 *
 * @param books - The input list of books.
 * @param filters - The filter configuration containing rating thresholds and sort settings.
 * @returns A new array of filtered and sorted books.
 */
export function applyFilters(books: Book[], filters: Filters): Book[] {
  return sortBooks(filterByRating(books, filters.minRating), filters.sort);
}