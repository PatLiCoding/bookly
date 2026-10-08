import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/use-cart-context";
import { useAuth } from "../context/use-auth";

/**
 * Returns the reason why checkout is not possible, or an empty string.
 *
 * @param isLoggedIn - Whether a user is logged in.
 * @param itemCount - Number of items in the cart.
 */
function getCheckoutError(isLoggedIn: boolean, itemCount: number): string {
  if (!isLoggedIn) return "Bestellen ist nur mit einem Account möglich.";
  if (itemCount === 0) return "Ihr Warenkorb ist leer.";
  return "";
}

/**
 * Validates checkout prerequisites (authenticated user and non-empty cart)
 * and navigates to the checkout page when they are met.
 */
export function useCheckoutGuard() {
  const { cartItems } = useCartContext();
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  function handleCheckout() {
    const error = getCheckoutError(!!loggedUser, cartItems.length);
    setErrorMsg(error);
    if (!error) navigate("/checkout");
  }

  return { errorMsg, handleCheckout };
}