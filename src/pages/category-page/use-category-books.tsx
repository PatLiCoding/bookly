import { useState } from "react";
import { highlightBooks } from "../../data/book-dummy-data";
import { applyFilters, NO_FILTERS } from "../../utils/book-filter";
import type { Filters } from "../../utils/book-filter";
import { getPageCount, paginate } from "../../utils/paginate";

const PAGE_SIZE = 10;

/** Books of one category, filtered, sorted and cut to the current page. */
export function useCategoryBooks(category: string | undefined) {
  const [filters, setFilters] = useState(NO_FILTERS);
  const [page, setPage] = useState(1);
  const inCategory = highlightBooks.filter((book) => book.category === category);
  const filtered = applyFilters(inCategory, filters);
  const pageCount = getPageCount(filtered.length, PAGE_SIZE);
  const books = paginate(filtered, page, PAGE_SIZE);
  const changeFilters = (next: Filters) => { setFilters(next); setPage(1); };

  return { books, filters, changeFilters, page, setPage, pageCount };
}