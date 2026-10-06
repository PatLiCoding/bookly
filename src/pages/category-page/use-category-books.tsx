import { useState } from "react";
import { getBooksByCategory } from "../../services/book-service";
import { useAsync } from "../../hooks/use-async";
import { applyFilters, NO_FILTERS } from "../../utils/book-filter";
import { searchBooks } from "../../utils/book-search";
import type { Filters } from "../../utils/book-filter";
import { getPageCount, paginate } from "../../utils/paginate";

const PAGE_SIZE = 10;

/** Loads the books of a category, then searches and filters them. */
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
  const changeFilters = (next: Filters) => { setFilters(next); setPage(1); };

  return { books, filters, changeFilters, page, setPage, pageCount, loading, error };
}