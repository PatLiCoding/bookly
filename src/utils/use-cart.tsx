import { useState } from "react";
import type { CartItem } from "../pages/cart-page/cart-page";

type NewCartItem = Omit<CartItem, "quantity">;

/** Manages all shopping cart actions. */
export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addItem(item: NewCartItem): void {
    setCartItems((prev) => {
      const existing = prev.find((line) => line.id === item.id);

      if (existing) {
        return prev.map((line) =>
          line.id === item.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(id: number): void {
    setCartItems((prev) =>
      prev
        .map((line) =>
          line.id === id
            ? { ...line, quantity: line.quantity - 1 }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }

  function clearCart(): void {
    setCartItems([]);
  }

  return {
    cartItems,
    addItem,
    removeItem,
    clearCart,
  };
}