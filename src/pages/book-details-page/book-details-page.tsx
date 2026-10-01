import { useParams } from "react-router-dom";
import { getBookById } from "../../services/book-service";
import BookDetails from "../../components/book-details/book-details";
import { useAuth } from "../../context/use-auth";
import { useCartContext } from "../../context/use-cart-context";

function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { loggedUser } = useAuth();
  const { cartItems, addItem, increaseItem, decreaseItem } = useCartContext();

  const book = getBookById(Number(id));

  if (!book) return <p>Buch nicht gefunden.</p>;

  const itemInCart = cartItems.find((item) => item.id === book.id);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;

  return (
    <BookDetails
      book={book}
      loggedUser={loggedUser}
      cartQuantity={cartQuantity}
      onAddToCart={addItem}
      onIncreaseItem={increaseItem}
      onDecreaseItem={decreaseItem}
    />
  );
}

export default BookDetailsPage;