import "./category-page.css";
import BookPreviewList from "../../components/book-preview-list/book-preview-list";
import { highlightBooks } from "../../data/book-dummy-data";

interface Props {
  category: string;
}

/** Shows all books of the selected category. */
function CategoryPage({ category }: Props) {
  const books = highlightBooks.filter((book) => book.category === category);
  return (
    <section className="category-page">
      <section className="filter-container">
        <h3>Filter</h3>
        <div className="filter-list">
          <p>Meistverkauft</p>
          <p>Beliebteste</p>
          <p>Neuerscheinungen</p>
          <p>Am meisten geliked</p>
          <p>Ab 4 Sterne</p>
          <p>Ab 3 Sterne</p>
          <p>Preis: Aufsteigend</p>
          <p>Preis: Absteigend</p>
        </div>
      </section>
      <h2>{category}</h2>
      <BookPreviewList books={books} />
    </section>
  );
}

export default CategoryPage;