import "./book-card.css";
import { Link } from "react-router-dom";
import type { Book } from "../../interface/book";
import { renderStars } from "../../utils/render-stars";
import { QuantityControl } from "../quantity-control/quantity-control";
import { getCover } from "../../utils/book-cover";
import { useBookCart, type ClickHandler } from "../../hooks/use-book-cart";

/** Props for the BookCard component and its parts. */
interface Props {
  /** Book entity data to display within the card. */
  book: Book;
}

/** Button that adds the book to the cart. */
function AddButton({ onClick }: { onClick: ClickHandler }) {
  return (
    <button
      className="cart-btn"
      title="In den Warenkorb"
      aria-label="In den Warenkorb"
      onClick={onClick}
    >
      <img src="./assets/icons/cart.png" alt="cart" />
    </button>
  );
}

/** Shows the add button or, if the book is in the cart, the quantity control. */
function CartControl({ book }: Props) {
  const { quantity, onAdd, onIncrease, onDecrease } = useBookCart(book);

  if (quantity === 0) return <AddButton onClick={onAdd} />;
  return (
    <QuantityControl
      quantity={quantity}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      size="small"
    />
  );
}

/** Price and cart controls at the bottom of the card. */
function CardFooter({ book }: Props) {
  return (
    <div className="card-footer">
      <span className="price">{book.price}</span>
      <CartControl book={book} />
    </div>
  );
}

/** Title, author, rating and footer of the card. */
function BookInfo({ book }: Props) {
  return (
    <div className="book-decription">
      <h3 className="title">{book.title}</h3>
      <p className="author">von {book.author}</p>
      <div className="rating-row">
        <div className="stars">{renderStars(book.rating)}</div>
      </div>
      <CardFooter book={book} />
    </div>
  );
}

/**
 * Renders a summary card for a single book, including image, author, ratings,
 * price, and cart controls.
 */
function BookCard({ book }: Props) {
  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <div className="cover-wrapper">
        <img className="bock-cover" src={getCover(book.cover)} alt={book.title} />
      </div>
      <BookInfo book={book} />
    </Link>
  );
}

export default BookCard;