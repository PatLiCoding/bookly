import { useParams } from "react-router-dom";
import { getBookById } from "../../services/book-service";
import BookDetails from "../../components/book-details/book-details";
import type { NewCartItem } from "../../utils/use-cart";
import type { User } from "../../interface/user";

interface Props {
  loggedUser: User | null;
  onAddToCart: (item: NewCartItem) => void;
}

function BookDetailsPage({ loggedUser, onAddToCart }: Props) {
  const { id } = useParams<{ id: string }>();
  const book = getBookById(Number(id));

  if (!book) return <p>Buch nicht gefunden.</p>;

  return (
    <BookDetails
      book={book}
      loggedUser={loggedUser}
      onAddToCart={onAddToCart}
    />
  );
}

export default BookDetailsPage;