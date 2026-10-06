import "./category-page.css";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BookPreviewList from "../../components/book-preview-list/book-preview-list";
import FilterSidebar from "../../components/filter-sidebar/filter-sidebar";
import Pagination from "../../components/pagination/pagination";
import LoadStatus from "../../components/load-status/load-status";
import { useCategoryBooks } from "./use-category-books";
import { useScrollTarget } from "./use-scroll-target";
import { countActiveFilters, NO_FILTERS, parseSort } from "../../utils/book-filter";
import type { Filters } from "../../utils/book-filter";
import { ALL_CATEGORY, ALL_LABEL } from "../../utils/category";

/** Type alias derived from the return type of the custom `useCategoryBooks` hook. */
type BookList = ReturnType<typeof useCategoryBooks>;

/**
 * Computes the page heading string based on current category name and search query parameters.
 *
 * @param name - Category identifier or slug from URL parameters.
 * @param query - Active search term query string.
 */
function pageTitle(name?: string, query = ""): string | undefined {
  if (query && name === ALL_CATEGORY) return `Suchergebnisse für „${query}“`;
  const title = name === ALL_CATEGORY ? ALL_LABEL : name;
  return query ? `${title}: „${query}“` : title;
}

/**
 * Generates button text indicating active filter count or toggle status.
 *
 * @param isOpen - Flag indicating whether the filter sidebar is currently visible.
 * @param activeCount - Number of currently active filter rules.
 */
function filterLabel(isOpen: boolean, activeCount: number): string {
  if (isOpen) return "Filter ausblenden";
  return activeCount > 0 ? `Filter (${activeCount})` : "Filter";
}

/** Props for the CategoryHeader component. */
interface HeaderProps {
  /** Heading title string to render. */
  title?: string;
  /** Whether the filter panel is expanded. */
  showFilters: boolean;
  /** Count of active filter parameters. */
  activeCount: number;
  /** Callback fired when the toggle filter button is clicked. */
  onToggle: () => void;
}

/**
 * Renders the category section header containing page title and filter toggle button.
 */
function CategoryHeader({
  title,
  showFilters,
  activeCount,
  onToggle,
}: HeaderProps) {
  return (
    <div className="category-header">
      <h2 className="category-title">{title}</h2>
      <button
        className="filter-btn"
        type="button"
        aria-expanded={showFilters}
        onClick={onToggle}
      >
        {filterLabel(showFilters, activeCount)}
      </button>
    </div>
  );
}

/**
 * Displays the grid list of book items, loading indicator, or empty state feedback.
 *
 * @param props - Component props containing the resolved book list object.
 */
function CategoryBooks({ list }: { list: BookList }) {
  const { loading, error, books } = list;
  return (
    <div className="category-books">
      <LoadStatus loading={loading} error={error} />
      {!loading && !error && books.length === 0 && (
        <p className="book-empty">Keine Bücher gefunden.</p>
      )}
      {books.length > 0 && <BookPreviewList books={books} layout="grid" />}
    </div>
  );
}

/**
 * Layout container positioning the book grid alongside the optional collapsible filter sidebar.
 */
function CategoryContent({
  list,
  showFilters,
}: {
  list: BookList;
  showFilters: boolean;
}) {
  return (
    <div className="category-content">
      <CategoryBooks list={list} />
      {showFilters && (
        <FilterSidebar filters={list.filters} onChange={list.changeFilters} />
      )}
    </div>
  );
}

/** Props required by the CategoryView inner component. */
interface ViewProps {
  /** Category slug name. */
  name?: string;
  /** Initial filter options including active sorting preference. */
  initialFilters: Filters;
  /** Search query string. */
  query: string;
}

/**
 * Manages category state (pagination, active filters, and scroll positioning target).
 */
function CategoryView({ name, initialFilters, query }: ViewProps) {
  const { setTarget, scrollThen } = useScrollTarget();
  const list = useCategoryBooks(name, initialFilters, query);
  const activeCount = countActiveFilters(list.filters);
  const [showFilters, setShowFilters] = useState(activeCount > 0);
  const changePage = (page: number) => scrollThen(() => list.setPage(page));

  return (
    <section className="category-page" ref={setTarget}>
      <CategoryHeader
        title={pageTitle(name, query)}
        showFilters={showFilters}
        activeCount={activeCount}
        onToggle={() => setShowFilters(!showFilters)}
      />
      <CategoryContent list={list} showFilters={showFilters} />
      <Pagination
        page={list.page}
        pageCount={list.pageCount}
        onChange={changePage}
      />
    </section>
  );
}

/**
 * Top-level route component parsing route parameters, query search, and preset sorting,
 * re-keying `CategoryView` to trigger state resets when parameters change.
 */
function CategoryPage() {
  const { name } = useParams();
  const [params] = useSearchParams();
  const sort = parseSort(params.get("sort"));
  const query = (params.get("q") ?? "").trim();
  const filters = { ...NO_FILTERS, sort };

  return (
    <CategoryView
      key={`${name}-${sort}-${query}`}
      name={name}
      initialFilters={filters}
      query={query}
    />
  );
}

export default CategoryPage;