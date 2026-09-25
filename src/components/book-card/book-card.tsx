import "./book-card.css";
import { Link } from "react-router-dom";
import type { Book } from "../../interface/book";
import type { CartItem } from "../../pages/cart-page/cart-page";
import { renderStars } from "../../utils/render-stars";
import { parsePrice } from "../../utils/parse-price";

interface Props {
  book: Book;
  onAddToCart: (item: CartItem) => void;
}

/** Displays one book with cover, rating, price and cart button. */
function BookCard({ book, onAddToCart }: Props) {
  function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onAddToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: parsePrice(book.price),
      cover: book.cover,
      quantity: 1,
    });
  }

  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <div className="cover-wrapper">
        <img className="bock-cover" src={book.cover} alt={book.title} />
      </div>
      <div className="book-decription">
        <h3 className="title">{book.title}</h3>
        <p className="author">von {book.author}</p>
        <div className="rating-row">
          <div className="stars">{renderStars(book.rating)}</div>
        </div>
        <div className="card-footer">
          <span className="price">{book.price}</span>
          <button
            className="cart-btn"
            title="In den Warenkorb"
            aria-label="In den Warenkorb"
            onClick={handleAddToCart}
          >
            <img src="/assets/icons/cart.png" alt="cart" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;