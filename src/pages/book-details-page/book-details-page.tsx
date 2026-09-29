import { useParams } from "react-router-dom";
import { getBookById } from "../../services/book-service";
import BookDetails from "../../components/book-details/book-details";
import type { NewCartItem } from "../../utils/use-cart";
import type { User } from "../../interface/user";
import type { CartItem } from "../cart-page/cart-page";

interface Props {
  loggedUser: User | null;
  cartItems?: CartItem[];
  onAddToCart: (item: NewCartItem) => void;
  onIncreaseItem?: (id: number) => void;
  onDecreaseItem?: (id: number) => void;
}

function BookDetailsPage({
  loggedUser,
  cartItems = [],
  onAddToCart,
  onIncreaseItem,
  onDecreaseItem,
}: Props) {
  const { id } = useParams<{ id: string }>();
  const book = getBookById(Number(id));

  if (!book) return <p>Buch nicht gefunden.</p>;

  const itemInCart = cartItems.find((item) => item.id === book.id);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;

  return (
    <BookDetails
      book={book}
      loggedUser={loggedUser}
      cartQuantity={cartQuantity}
      onAddToCart={onAddToCart}
      onIncreaseItem={onIncreaseItem}
      onDecreaseItem={onDecreaseItem}
    />
  );
}

export default BookDetailsPage;