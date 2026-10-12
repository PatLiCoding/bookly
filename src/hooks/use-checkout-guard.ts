import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/use-cart-context";
import { useAuth } from "../context/use-auth";
import { useCartAvailability } from "./use-cart-availability";

/**
 * Validates checkout prerequisites (authenticated user, non-empty cart, available books)
 * and navigates to the checkout page when all conditions are met.
 */
export function useCheckoutGuard() {
  const { cartItems } = useCartContext();
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const { ensureAvailable } = useCartAvailability();

  /** Validates user, cart and book availability before navigating to checkout. */
  async function handleCheckout() {
    if (!loggedUser)
      return setErrorMsg("Bestellen ist nur mit einem Account möglich.");
    if (!cartItems.length) return setErrorMsg("Dein Warenkorb ist leer.");
    try {
      if (!(await ensureAvailable())) return;
      navigate("/checkout");
    } catch {
      setErrorMsg(
        "Die Verfügbarkeit konnte nicht geprüft werden. Bitte versuche es erneut.",
      );
    }
  }

  return { errorMsg, handleCheckout };
}
