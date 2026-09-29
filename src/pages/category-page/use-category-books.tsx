import { useState } from "react";
import { getBooksByCategory } from "../../services/book-service";
import { applyFilters, NO_FILTERS } from "../../utils/book-filter";
import { searchBooks } from "../../utils/book-search";
import type { Filters } from "../../utils/book-filter";
import { getPageCount, paginate } from "../../utils/paginate";

const PAGE_SIZE = 10;

export function useCategoryBooks(
  category: string | undefined,
  initialFilters: Filters = NO_FILTERS,
  query = "",
) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const found = searchBooks(getBooksByCategory(category), query);
  const filtered = applyFilters(found, filters);
  const pageCount = getPageCount(filtered.length, PAGE_SIZE);
  const books = paginate(filtered, page, PAGE_SIZE);
  const changeFilters = (next: Filters) => { setFilters(next); setPage(1); };

  return { books, filters, changeFilters, page, setPage, pageCount };
}