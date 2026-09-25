import "./category-page.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import BookPreviewList from "../../components/book-preview-list/book-preview-list";
import FilterSidebar from "../../components/filter-sidebar/filter-sidebar";
import Pagination from "../../components/pagination/pagination";
import { useCategoryBooks } from "./use-category-books";
import { useScrollTarget } from "./use-scroll-target";
import type { CartItem } from "../../pages/cart-page/cart-page";

type BookList = ReturnType<typeof useCategoryBooks>;

interface HeaderProps {
  title?: string;
  showFilters: boolean;
  onToggle: () => void;
}

/** Category title on the left, filter toggle on the right. */
function CategoryHeader({ title, showFilters, onToggle }: HeaderProps) {
  return (
    <div className="category-header">
      <h2 className="category-title">{title}</h2>
      <button className="filter-btn" type="button" aria-expanded={showFilters} onClick={onToggle}>
        {showFilters ? "Filter ausblenden" : "Filter"}
      </button>
    </div>
  );
}

/** Book grid, or a hint if no book matches. */
function CategoryBooks({ list, onAddToCart }: { list: BookList; onAddToCart: (item: CartItem) => void } ) {
  return (
    <div className="category-books">
      {list.books.length === 0 ? <p>Keine Bücher gefunden.</p> : <BookPreviewList books={list.books} layout="grid" onAddToCart={onAddToCart}/>}
    </div>
  );
}

/** Book list next to the (optional) filter sidebar. */
function CategoryContent({ list, showFilters, onAddToCart }: { list: BookList; showFilters: boolean;onAddToCart: (item: CartItem) => void }) {
  return (
    <div className="category-content">
      <CategoryBooks list={list} onAddToCart={onAddToCart}/>
      {showFilters && <FilterSidebar filters={list.filters} onChange={list.changeFilters} />}
    </div>
  );
}

/** Category view; state (page, filters) lives here and resets via the key below. */
function CategoryView({ name, onAddToCart }: { name?: string; onAddToCart: (item: CartItem) => void }) {
  const [showFilters, setShowFilters] = useState(true);
  const { setTarget, scrollThen } = useScrollTarget();
  const list = useCategoryBooks(name);
  const changePage = (page: number) => scrollThen(() => list.setPage(page));

  return (
    <section className="category-page" ref={setTarget}>
      <CategoryHeader title={name} showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
      <CategoryContent list={list} showFilters={showFilters} onAddToCart={onAddToCart} />
      <Pagination page={list.page} pageCount={list.pageCount} onChange={changePage} />
    </section>
  );
}

/** Shows the books of the selected category (10 per page) with filters and sorting. */
function CategoryPage({ onAddToCart }: { onAddToCart: (item: CartItem) => void }) {
  const { name } = useParams();
  return <CategoryView key={name} name={name} onAddToCart={onAddToCart} />;
}

export default CategoryPage;