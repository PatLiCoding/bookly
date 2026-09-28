import { useParams } from "react-router-dom";
import { getBookById } from "../../services/book-service";
import BookDetails from "../../components/book-details/book-details";
import type { NewCartItem } from "../../utils/use-cart";

interface Props {
  onAddToCart: (item: NewCartItem) => void;
}

function BookDetailsPage({ onAddToCart }: Props) {
  const { id } = useParams<{ id: string }>();
  const book = getBookById(Number(id));

  if (!book) return <p>Buch nicht gefunden.</p>;

  return <BookDetails book={book} onAddToCart={onAddToCart} />;
}

export default BookDetailsPage;