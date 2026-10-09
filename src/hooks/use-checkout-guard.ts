import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/use-cart-context";
import { useAuth } from "../context/use-auth";
import { findMissingBookIds } from "../services/book-service";

/**
 * Validates checkout prerequisites (authenticated user, non-empty cart, available books)
 * and navigates to the checkout page when all conditions are met.
 */
export function useCheckoutGuard() {
  const { cartItems, removeItem } = useCartContext();
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  /** Validates cart item availability and user authentication before navigating to checkout. */
  async function handleCheckout() {
    if (!loggedUser)
      return setErrorMsg("Bestellen ist nur mit einem Account möglich.");
    if (!cartItems.length) return setErrorMsg("Ihr Warenkorb ist leer.");
    const missing = await findMissingBookIds(cartItems.map((i) => i.id));
    if (missing.length) {
      missing.forEach(removeItem);
      return setErrorMsg("Nicht mehr verfügbare Artikel wurden entfernt.");
    }
    navigate("/checkout");
  }
  return { errorMsg, handleCheckout };
}
