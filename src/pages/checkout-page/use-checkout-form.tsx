import { useState } from "react";
import type { User } from "../../interface/user";
import type { Values } from "../../interface/checkout";
import { useCartContext } from "../../context/use-cart-context";
import { useAuth } from "../../context/use-auth";
import { useValues } from "../../hooks/use-values";
import { useCartAvailability } from "../../hooks/use-cart-availability";
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
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billing, setBilling] = useValues(() => initialBilling(user));
  const [shipping, setShipping] = useValues(() => initialShipping(user));
  const [error, setError] = useState("");
  const placeOrder = useOrder(user, onOrdered);
  const { ensureAvailable } = useCartAvailability();

  /**
   * Updates a specific billing field and automatically syncs it to the shipping address
   * if the "same as billing" option is enabled.
   *
   * @param key - The field key being modified.
   * @param value - The new field value.
   */
  const changeBilling = (key: string, value: string) => {
    setBilling(key, value);
    if (sameAsBilling) {
      const shippingKey = key === "firstname" ? "Firstname" : key === "lastname" ? "Lastname" : key;
      setShipping(shippingKey, value);
    }
  };

  /**
   * Toggles whether the shipping address matches the billing address.
   * Copies current billing values over to shipping if checked.
   *
   * @param checked - Boolean flag indicating if shipping equals billing.
   */
  const toggleSameAsBilling = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      setShipping("Firstname", billing.firstname ?? "");
      setShipping("Lastname", billing.lastname ?? "");
      setShipping("street", billing.street ?? "");
      setShipping("zip", billing.zip ?? "");
      setShipping("city", billing.city ?? "");
      setShipping("country", billing.country ?? "");
    }
  };

  /**
   * Validates form inputs and terms acceptance, submitting the order payload if valid.
   *
   * @param agb - Flag indicating whether terms and conditions were accepted.
   */
  async function submit(agb: boolean) {
    const problem = validateCheckout(billing, shipping, agb);
    if (problem) return setError(problem);
    setError("");
    try {
      if (!(await ensureAvailable())) return;
      await placeOrder(toFormData(billing, shipping));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bestellung fehlgeschlagen. Bitte versuche es erneut.");
    }
  }

  return {
    billing,
    changeBilling,
    shipping,
    changeShipping: setShipping,
    sameAsBilling,
    toggleSameAsBilling,
    error,
    submit,
  };
}