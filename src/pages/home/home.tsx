import "./home.css";
import { Link } from "react-router-dom";
import BookPreviewList from "../../components/book-preview-list/book-preview-list";
import { getBooks } from "../../services/book-service";
import type { CartItem } from "../cart-page/cart-page";

interface HomeProps {
  onAddToCart: (item: CartItem) => void;
}

const books = getBooks();

function Home({ onAddToCart }: HomeProps) {
  return (
    <section className="home">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-part-1">Finde deine nächste </span>
            <br />
            <span className="hero-title-part-2">Lieblings&shy;geschichte.</span>
          </h1>
          <p className="hero-subtitle">
            Handverlesene Bücher, persönliche Empfehlungen und
            versandkostenfreie Lieferung direkt zu dir nach Hause.
          </p>
          <Link to="/kategorie/Fantasy" className="hero-btn">
            Bestseller entdecken
          </Link>
        </div>
      </section>

      <section className="books-container">
        <section className="highlights">
          <div className="section-header">
            <h2 className="container-title">Unsere Highlights</h2>
            <Link to="/" className="view-all-link">Alle ansehen &rarr;</Link>
          </div>
          <BookPreviewList books={books} onAddToCart={onAddToCart} />
        </section>

        <section className="releases">
          <div className="section-header">
            <h2 className="container-title">Neuheiten</h2>
            <Link to="/" className="view-all-link">Alle ansehen &rarr;</Link>
          </div>
          <BookPreviewList books={books} onAddToCart={onAddToCart} />
        </section>
      </section>
    </section>
  );
}

export default Home;