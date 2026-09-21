import "./book-card.css";
import type { Book } from "../../interface/book";
import { renderStars } from "../../utils/render-stars";

interface Props {
  book: Book;
}

/** Displays one book with cover, rating, price and cart button. */
function BookCard({ book }: Props) {
  return (
    <div className="book-card">
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
          <button className="cart-btn" title="In den Warenkorb" aria-label="In den Warenkorb">
            <img src="/assets/icons/cart.png" alt="cart" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;