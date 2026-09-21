import "./category-page.css";
import { useParams } from "react-router-dom";
import BookPreviewList from "../../components/book-preview-list/book-preview-list";
import { highlightBooks } from "../../data/book-dummy-data";


/** Shows all books of the selected category. */
function CategoryPage() {
  const { name } = useParams();
  const books = highlightBooks.filter((book) => book.category === name);

  return (
    <section className="category-page">
        <a className="view-all-link">Filter</a>
      <h2>{name}</h2>
      <BookPreviewList books={books} />
      {/* <div className="filter-list">
          <p>Meistverkauft</p>
          <p>Beliebteste</p>
          <p>Neuerscheinungen</p>
          <p>Am meisten geliked</p>
          <p>Ab 4 Sterne</p>
          <p>Ab 3 Sterne</p>
          <p>Preis: Aufsteigend</p>
          <p>Preis: Absteigend</p>
        </div> */}
    </section>
  );
}

export default CategoryPage;