import { useContext } from "react";
import { CartContext } from "./cart-context";

/**
 * Custom React hook consuming the global `CartContext`.
 *
 * @returns The active `CartContextType` value object containing cart items and operations.
 * @throws {Error} If invoked outside of a `<CartProvider>` wrapper.
 */
export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCartContext muss innerhalb eines CartProviders verwendet werden",
    );
  }
  return context;
}
