import "./book-preview-list.css";
import type { Book } from "../../interface/book";
import BookCard from "../book-card/book-card";

interface Props {
  books: Book[];
}

/** Renders the given books as a scrollable row of cards. */
function BookPreviewList({ books }: Props) {
  return (
    <div className="book-preview">
      <div className="book-preview-inner">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default BookPreviewList;