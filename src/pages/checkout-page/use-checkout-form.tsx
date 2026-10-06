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

/**
 * Internal hook producing an async handler that submits the finalized order,
 * syncs user context updates, clears the cart, and invokes the success callback.
 *
 * @param user - Active user profile object.
 * @param onOrdered - Callback function triggered upon success.
 */
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

/**
 * Custom React hook orchestrating billing/shipping address state, validation checking,
 * error state reporting, and order submission execution for the checkout form.
 *
 * @param user - Current authenticated user.
 * @param onOrdered - Completion callback when checkout succeeds.
 * @returns State properties and submission handler for managing checkout inputs.
 */
export function useCheckoutForm(user: User, onOrdered: () => void) {
  const [billing, changeBilling] = useValues(() => initialBilling(user));
  const [shipping, changeShipping] = useValues(() => initialShipping(user));
  const [error, setError] = useState("");
  const placeOrder = useOrder(user, onOrdered);

  /**
   * Validates form inputs and terms acceptance, submitting the order payload if valid.
   *
   * @param agb - Flag indicating whether terms and conditions were accepted.
   */
  async function submit(agb: boolean) {
    const problem = validateCheckout(billing, shipping, agb);
    if (problem) return setError(problem);
    await placeOrder(toFormData(billing, shipping));
  }

  return { billing, changeBilling, shipping, changeShipping, error, submit };
}