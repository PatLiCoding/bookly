import "./category-page.css";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BookPreviewList from "../../components/book-preview-list/book-preview-list";
import FilterSidebar from "../../components/filter-sidebar/filter-sidebar";
import Pagination from "../../components/pagination/pagination";
import { useCategoryBooks } from "./use-category-books";
import { useScrollTarget } from "./use-scroll-target";
import { countActiveFilters, NO_FILTERS, parseSort } from "../../utils/book-filter";
import type { Filters } from "../../utils/book-filter";
import { ALL_CATEGORY, ALL_LABEL } from "../../utils/category";
import type { CartItem } from "../../pages/cart-page/cart-page";

type BookList = ReturnType<typeof useCategoryBooks>;
type AddToCart = (item: CartItem) => void;

/** Title of the page: the "all books" key gets its label, a search adds the term. */
function pageTitle(name?: string, query = ""): string | undefined {
  if (query && name === ALL_CATEGORY) return `Suchergebnisse für „${query}“`;
  const title = name === ALL_CATEGORY ? ALL_LABEL : name;
  return query ? `${title}: „${query}“` : title;
}

/** Label of the filter button; while closed it shows how many filters are active. */
function filterLabel(isOpen: boolean, activeCount: number): string {
  if (isOpen) return "Filter ausblenden";
  return activeCount > 0 ? `Filter (${activeCount})` : "Filter";
}

interface HeaderProps {
  title?: string;
  showFilters: boolean;
  activeCount: number;
  onToggle: () => void;
}

/** Category title on the left, filter toggle on the right. */
function CategoryHeader({ title, showFilters, activeCount, onToggle }: HeaderProps) {
  return (
    <div className="category-header">
      <h2 className="category-title">{title}</h2>
      <button className="filter-btn" type="button" aria-expanded={showFilters} onClick={onToggle}>
        {filterLabel(showFilters, activeCount)}
      </button>
    </div>
  );
}

/** Book grid, or a hint if no book matches. */
function CategoryBooks({ list, onAddToCart }: { list: BookList; onAddToCart: AddToCart }) {
  return (
    <div className="category-books">
      {list.books.length === 0 ? <p>Keine Bücher gefunden.</p> : <BookPreviewList books={list.books} layout="grid" onAddToCart={onAddToCart} />}
    </div>
  );
}

/** Book list next to the (optional) filter sidebar. */
function CategoryContent({ list, showFilters, onAddToCart }: { list: BookList; showFilters: boolean; onAddToCart: AddToCart }) {
  return (
    <div className="category-content">
      <CategoryBooks list={list} onAddToCart={onAddToCart} />
      {showFilters && <FilterSidebar filters={list.filters} onChange={list.changeFilters} />}
    </div>
  );
}

interface ViewProps {
  name?: string;
  initialFilters: Filters;
  query: string;
  onAddToCart: AddToCart;
}

/** Category view; state (page, filters) lives here and resets via the key below. */
function CategoryView({ name, initialFilters, query, onAddToCart }: ViewProps) {
  const { setTarget, scrollThen } = useScrollTarget();
  const list = useCategoryBooks(name, initialFilters, query);
  const activeCount = countActiveFilters(list.filters);
  const [showFilters, setShowFilters] = useState(activeCount > 0);
  const changePage = (page: number) => scrollThen(() => list.setPage(page));

  return (
    <section className="category-page" ref={setTarget}>
      <CategoryHeader title={pageTitle(name, query)} showFilters={showFilters} activeCount={activeCount} onToggle={() => setShowFilters(!showFilters)} />
      <CategoryContent list={list} showFilters={showFilters} onAddToCart={onAddToCart} />
      <Pagination page={list.page} pageCount={list.pageCount} onChange={changePage} />
    </section>
  );
}

/** Shows the books of the selected category (10 per page); `?sort=` presets the sorting, `?q=` searches title and author. */
function CategoryPage({ onAddToCart }: { onAddToCart: AddToCart }) {
  const { name } = useParams();
  const [params] = useSearchParams();
  const sort = parseSort(params.get("sort"));
  const query = (params.get("q") ?? "").trim();
  const filters = { ...NO_FILTERS, sort };
  return <CategoryView key={`${name}-${sort}-${query}`} name={name} initialFilters={filters} query={query} onAddToCart={onAddToCart} />;
}

export default CategoryPage;