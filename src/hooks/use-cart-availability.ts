import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/use-cart-context";
import { findMissingBookIds } from "../services/book-service";

/**
 * Checks that all books in the cart can still be ordered. Unavailable books
 * are removed and the user is sent to the cart page with a notice.
 */
export function useCartAvailability() {
  const { cartItems, removeItem } = useCartContext();
  const navigate = useNavigate();

  /** Resolves to true if the order may continue, false if the cart changed. */
  async function ensureAvailable(): Promise<boolean> {
    const missing = new Set(
      await findMissingBookIds(cartItems.map((i) => i.id)),
    );
    if (missing.size === 0) return true;
    const removed = cartItems.filter((i) => missing.has(i.id));
    removed.forEach((i) => removeItem(i.id));
    navigate("/cart", {
      replace: true,
      state: { removedTitles: removed.map((i) => i.title) },
    });
    return false;
  }

  return { ensureAvailable };
}
