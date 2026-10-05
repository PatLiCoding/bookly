import { useParams } from "react-router-dom";
import { getBookById } from "../../services/book-service";
import BookDetails from "../../components/book-details/book-details";
import LoadStatus from "../../components/load-status/load-status";
import { useAsync } from "../../hooks/use-async";
import { useAuth } from "../../context/use-auth";
import { useCartContext } from "../../context/use-cart-context";

function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { loggedUser } = useAuth();
  const { cartItems, addItem, increaseItem, decreaseItem } = useCartContext();
  const { data: book, loading, error } = useAsync(
    () => getBookById(Number(id)),
    [id],
  );

  if (loading || error) return <LoadStatus loading={loading} error={error} />;
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