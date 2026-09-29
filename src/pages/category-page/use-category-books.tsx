import { useState } from "react";
import { getBooksByCategory } from "../../services/book-service";
import { applyFilters, NO_FILTERS } from "../../utils/book-filter";
import type { Filters } from "../../utils/book-filter";
import { getPageCount, paginate } from "../../utils/paginate";

const PAGE_SIZE = 10;

/** Books of one category (or all), filtered, sorted and cut to the current page. */
export function useCategoryBooks(
  category: string | undefined,
  initialFilters: Filters = NO_FILTERS,
) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const filtered = applyFilters(getBooksByCategory(category), filters);
  const pageCount = getPageCount(filtered.length, PAGE_SIZE);
  const books = paginate(filtered, page, PAGE_SIZE);
  const changeFilters = (next: Filters) => { setFilters(next); setPage(1); };

  return { books, filters, changeFilters, page, setPage, pageCount };
}