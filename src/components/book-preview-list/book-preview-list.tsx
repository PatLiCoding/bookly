import "./book-preview-list.css";
import type { Book } from "../../interface/book";
import BookCard from "../book-card/book-card";

/** Props for the BookPreviewList component. */
interface Props {
  /** Array of book entities to be displayed. */
  books: Book[];
  /**
   * Layout presentation style.
   * - `"scroll"`: Horizontal scrollable row.
   * - `"grid"`: Multi-column wrapping grid.
   * 
   * @defaultValue `"scroll"`
   */
  layout?: "scroll" | "grid";
}

/**
 * Renders a list of book preview cards in either a horizontal scroll container or a grid layout.
 */
function BookPreviewList({ books, layout = "scroll" }: Props) {
  return (
    <div className={`book-preview book-preview--${layout}`}>
      <div className="book-preview-inner">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default BookPreviewList;