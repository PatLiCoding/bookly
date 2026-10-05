import { useState } from "react";
import type { User } from "../../interface/user";
import type { Values } from "../../interface/checkout";
import { useCartContext } from "../../context/use-cart-context";
import { useAuth } from "../../context/use-auth";
import { useValues } from "./use-values";
import {
  initialBilling,
  initialShipping,
  processCheckoutOrder,
  toFormData,
  validateCheckout,
} from "../../services/checkout-service";

function useOrder(user: User, onOrdered: () => void) {
  const { cartItems, clearCart } = useCartContext();
  const { updateUser } = useAuth();

  return async (formData: Values) => {
    const { updatedUser } = await processCheckoutOrder(user, cartItems, formData);
    updateUser(updatedUser);
    clearCart();
    onOrdered();
  };
}

export function useCheckoutForm(user: User, onOrdered: () => void) {
  const [billing, changeBilling] = useValues(() => initialBilling(user));
  const [shipping, changeShipping] = useValues(() => initialShipping(user));
  const [error, setError] = useState("");
  const placeOrder = useOrder(user, onOrdered);

  async function submit(agb: boolean) {
    const problem = validateCheckout(billing, shipping, agb);
    if (problem) return setError(problem);
    await placeOrder(toFormData(billing, shipping));
  }

  return { billing, changeBilling, shipping, changeShipping, error, submit };
}