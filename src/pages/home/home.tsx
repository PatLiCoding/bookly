import "./home.css";
import BookPreviewList from "../../components/book-preview-list/book-preview-list";
import { highlightBooks } from "../../data/book-dummy-data";

function Home() {
    return (
    <section className="home">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-part-1">Finde deine nächste </span>
            <br />
            <span className="hero-title-part-2">Lieblingsgeschichte.</span>
          </h1>
          <p className="hero-subtitle">
            Handverlesene Bücher, persönliche Empfehlungen und
            versandkostenfreie Lieferung direkt zu dir nach Hause.
          </p>
          <div className="hero-btn">Bestseller entdecken</div>
        </div>
      </section>

      <section className="books-container">
        <section className="books-container">
        <section className="highlights">
          <div className="section-header">
            <h2 className="container-title">Unsere Highlights</h2>
            <a className="view-all-link">Alle ansehen &rarr;</a>
          </div>
          <BookPreviewList books={highlightBooks} />
        </section>

        <section className="releases">
          <div className="section-header">
            <h2 className="container-title">Neuheiten</h2>
            <a className="view-all-link">Alle ansehen &rarr;</a>
          </div>
          <BookPreviewList books={highlightBooks} />
        </section>
      </section>
      </section>
    </section>
  );
}

export default Home;
