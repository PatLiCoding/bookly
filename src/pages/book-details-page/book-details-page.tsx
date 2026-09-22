import { useParams } from "react-router-dom";
import { highlightBooks } from "../../data/book-dummy-data";
import BookDetails from "../../components/book-details/book-details";
import type { Book } from "../../interface/book";

function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const book: Book | undefined = highlightBooks.find((b) => b.id === Number(id));

  if (!book) return <p>Buch nicht gefunden.</p>;

  return <BookDetails book={book} />;
}

export default BookDetailsPage;