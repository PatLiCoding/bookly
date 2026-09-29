import "./book-preview-list.css";
import type { Book } from "../../interface/book";
import type { CartItem } from "../../pages/cart-page/cart-page";
import BookCard from "../book-card/book-card";

interface Props {
  books: Book[];
  layout?: "scroll" | "grid";
  cartItems?: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onIncreaseItem?: (id: number) => void;
  onDecreaseItem?: (id: number) => void;
}

/** Renders the given books as a scrollable row or a wrapping grid of cards. */
function BookPreviewList({
  books,
  layout = "scroll",
  cartItems = [],
  onAddToCart,
  onIncreaseItem,
  onDecreaseItem,
}: Props) {
  return (
    <div className={`book-preview book-preview--${layout}`}>
      <div className="book-preview-inner">
        {books.map((book) => {
          const itemInCart = cartItems.find((item) => item.id === book.id);
          const quantity = itemInCart ? itemInCart.quantity : 0;

          return (
            <BookCard
              key={book.id}
              book={book}
              cartQuantity={quantity}
              onAddToCart={onAddToCart}
              onIncreaseItem={onIncreaseItem}
              onDecreaseItem={onDecreaseItem}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BookPreviewList;