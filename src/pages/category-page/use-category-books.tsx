import { useState } from "react";
import { getBooksByCategory } from "../../services/book-service";
import { useAsync } from "../../hooks/use-async";
import { applyFilters, NO_FILTERS } from "../../utils/book-filter";
import { searchBooks } from "../../utils/book-search";
import type { Filters } from "../../utils/book-filter";
import { getPageCount, paginate } from "../../utils/paginate";

const PAGE_SIZE = 10;

/**
 * Internal hook that fetches books for a category, applies text search filtering,
 * and executes custom dynamic filter rules.
 *
 * @param category - Optional category slug or identifier.
 * @param query - Text query string for filtering book title or author.
 * @param filters - Active filter configuration object.
 */
function useFilteredBooks(
  category: string | undefined,
  query: string,
  filters: Filters,
) {
  const { data, loading, error } = useAsync(
    () => getBooksByCategory(category),
    [category],
  );
  const found = searchBooks(data ?? [], query);
  return { filtered: applyFilters(found, filters), loading, error };
}

/**
 * Custom React hook that handles book retrieval, client-side searching, dynamic filtering,
 * and page-based pagination state for category views.
 *
 * @param category - Selected category slug or identifier.
 * @param initialFilters - Initial filter rules to seed state.
 * @param query - Optional initial text search query string.
 * @returns Object containing paginated books, page controls, filter state, and async status flags.
 */
export function useCategoryBooks(
  category: string | undefined,
  initialFilters: Filters = NO_FILTERS,
  query = "",
) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const { filtered, loading, error } = useFilteredBooks(category, query, filters);
  const pageCount = getPageCount(filtered.length, PAGE_SIZE);
  const books = paginate(filtered, page, PAGE_SIZE);

  /**
   * Updates current filter options and resets the current page view back to page 1.
   *
   * @param next - Updated filter rule state object.
   */
  const changeFilters = (next: Filters) => {
    setFilters(next);
    setPage(1);
  };

  return { books, filters, changeFilters, page, setPage, pageCount, loading, error };
}