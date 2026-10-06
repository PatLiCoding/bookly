import "./book-card.css";
import { Link } from "react-router-dom";
import type { Book } from "../../interface/book";
import { renderStars } from "../../utils/render-stars";
import { parsePrice } from "../../utils/parse-price";
import { QuantityControl } from "../quantity-control/quantity-control";
import { useCartContext } from "../../context/use-cart-context";
import { getCover } from "../../utils/book-cover";

interface Props {
  book: Book;
}

function BookCard({ book }: Props) {
  const { cartItems, addItem, increaseItem, decreaseItem } = useCartContext();

  const itemInCart = cartItems.find((item) => item.id === book.id);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;

  function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      id: book.id,
      title: book.title,
      author: book.author,
      price: parsePrice(book.price),
      cover: getCover(book.cover),
    });
  }

  function handleIncrease(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    increaseItem(book.id);
  }

  function handleDecrease(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    decreaseItem(book.id);
  }

  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <div className="cover-wrapper">
        <img className="bock-cover" src={getCover(book.cover)} alt={book.title} />
      </div>
      <div className="book-decription">
        <h3 className="title">{book.title}</h3>
        <p className="author">von {book.author}</p>
        <div className="rating-row">
          <div className="stars">{renderStars(book.rating)}</div>
        </div>
        <div className="card-footer">
          <span className="price">{book.price}</span>

          {cartQuantity > 0 ? (
            <QuantityControl
              quantity={cartQuantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              size="small"
            />
          ) : (
            <button
              className="cart-btn"
              title="In den Warenkorb"
              aria-label="In den Warenkorb"
              onClick={handleAddToCart}
            >
              <img src="./assets/icons/cart.png" alt="cart" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export default BookCard;