import { type ReactNode } from "react";
import { useCart } from "../utils/use-cart";
import { CartContext } from "./cart-context";

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  const cartCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ ...cart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}