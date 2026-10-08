import { type ReactNode } from "react";
import { useCart } from "../hooks/use-cart";
import { CartContext } from "./cart-context";

/** Props for the CartProvider component. */
interface CartProviderProps {
  /** React child elements wrapped by the cart context provider. */
  children: ReactNode;
}

/**
 * Context Provider component wrapping children with shopping cart state,
 * action methods, and a computed `cartCount` derived from item quantities.
 */
export function CartProvider({ children }: CartProviderProps) {
  const cart = useCart();
  const cartCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ ...cart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}