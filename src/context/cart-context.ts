import { createContext } from "react";
import type { NewCartItem } from "../hooks/use-cart";
import type { CartItem } from "../interface/cart-item";

/** Interface defining the shopping cart context shape and mutation methods. */
export interface CartContextType {
  /** Array of item entries currently in the shopping cart. */
  cartItems: CartItem[];
  /** Total quantity count of all items combined. */
  cartCount: number;
  /** Adds a new book or item entry to the cart. */
  addItem: (item: NewCartItem) => void;
  /** Increments the quantity of a specific cart item by ID. */
  increaseItem: (id: number) => void;
  /** Decrements the quantity of a specific cart item by ID. */
  decreaseItem: (id: number) => void;
  /** Removes an item entirely from the shopping cart. */
  removeItem: (id: number) => void;
  /** Clears all items from the shopping cart. */
  clearCart: () => void;
}

/** React Context supplying shopping cart state and modification actions across the app. */
export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);
