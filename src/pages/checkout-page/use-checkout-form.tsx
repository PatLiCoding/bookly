import { useState } from "react";
import type { User } from "../../interface/user";
import type { Values } from "../../interface/checkout";
import { useCartContext } from "../../context/use-cart-context";
import { useAuth } from "../../context/use-auth";
import { useValues } from "./use-values";
import {
  buildUpdatedUser,
  createOrder,
  initialBilling,
  initialShipping,
  toFormData,
  validateCheckout,
} from "../../services/checkout-service";

function useOrder(user: User, onOrdered: () => void) {
  const { cartItems, clearCart } = useCartContext();
  const { updateUser } = useAuth();

  return (formData: Values) => {
    const order = createOrder(cartItems);
    updateUser(buildUpdatedUser(user, order, formData));
    clearCart();
    onOrdered();
  };
}

export function useCheckoutForm(user: User, onOrdered: () => void) {
  const [billing, changeBilling] = useValues(() => initialBilling(user));
  const [shipping, changeShipping] = useValues(() => initialShipping(user));
  const [error, setError] = useState("");
  const placeOrder = useOrder(user, onOrdered);

  function submit(agb: boolean) {
    const problem = validateCheckout(billing, shipping, agb);
    if (problem) return setError(problem);
    placeOrder(toFormData(billing, shipping));
  }

  return { billing, changeBilling, shipping, changeShipping, error, submit };
}