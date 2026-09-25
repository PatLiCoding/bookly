import { useParams } from "react-router-dom";
import { highlightBooks } from "../../data/book-dummy-data";
import BookDetails from "../../components/book-details/book-details";
import type { Book } from "../../interface/book";
import type { CartItem } from "../cart-page/cart-page";

interface Props {
  onAddToCart: (item: CartItem) => void;
}

function BookDetailsPage({ onAddToCart }: Props) {
  const { id } = useParams<{ id: string }>();
  const book: Book | undefined = highlightBooks.find((b) => b.id === Number(id));

  if (!book) return <p>Buch nicht gefunden.</p>;

  return <BookDetails book={book} onAddToCart={onAddToCart} />;
}

export default BookDetailsPage;