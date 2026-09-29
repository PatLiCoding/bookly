import "./home.css";
import { Link } from "react-router-dom";
import BookPreviewList from "../../components/book-preview-list/book-preview-list";
import {
  getNewestBooks,
  getTopRatedBooks,
} from "../../services/book-service";
import { ALL_CATEGORY } from "../../utils/category";
import type { CartItem } from "../cart-page/cart-page";

interface HomeProps {
  cartItems?: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onIncreaseItem?: (id: number) => void;
  onDecreaseItem?: (id: number) => void;
}
const PREVIEW_COUNT = 6;

function Home({
  cartItems = [],
  onAddToCart,
  onIncreaseItem,
  onDecreaseItem,
}: HomeProps) {
  const highlights = getTopRatedBooks(PREVIEW_COUNT);
  const releases = getNewestBooks(PREVIEW_COUNT);

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
          <Link to="/category/Fantasy" className="hero-btn">
            Bestseller entdecken
          </Link>
        </div>
      </section>

      <section className="books-container">
        <section className="highlights">
          <div className="section-header">
            <h2 className="container-title">Unsere Highlights</h2>
            <Link to={`/category/${ALL_CATEGORY}?sort=rating`} className="view-all-link">Alle ansehen &rarr;</Link>
          </div>
          <BookPreviewList
            books={highlights}
            cartItems={cartItems}
            onAddToCart={onAddToCart}
            onIncreaseItem={onIncreaseItem}
            onDecreaseItem={onDecreaseItem}
          />
        </section>

        <section className="releases">
          <div className="section-header">
            <h2 className="container-title">Neuheiten</h2>
            <Link to={`/category/${ALL_CATEGORY}?sort=newest`} className="view-all-link">Alle ansehen &rarr;</Link>
          </div>
          <BookPreviewList
            books={releases}
            cartItems={cartItems}
            onAddToCart={onAddToCart}
            onIncreaseItem={onIncreaseItem}
            onDecreaseItem={onDecreaseItem}
          />
        </section>
      </section>
    </section>
  );
}

export default Home;