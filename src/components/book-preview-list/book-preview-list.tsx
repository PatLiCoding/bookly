import "./book-preview-list.css";
import type { Book } from "../../interface/book";
import type { CartItem } from "../../pages/cart-page/cart-page";
import BookCard from "../book-card/book-card";

interface Props {
  books: Book[];
  /** "scroll" = one horizontal row, "grid" = wraps onto multiple rows. */
  layout?: "scroll" | "grid";
  onAddToCart: (item: CartItem) => void;
}

/** Renders the given books as a scrollable row or a wrapping grid of cards. */
function BookPreviewList({ books, layout = "scroll", onAddToCart }: Props) {
  return (
    <div className={`book-preview book-preview--${layout}`}>
      <div className="book-preview-inner">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onAddToCart={onAddToCart}/>
        ))}
      </div>
    </div>
  );
}

export default BookPreviewList;