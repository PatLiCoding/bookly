import { createContext } from "react";
import type { NewCartItem } from "../utils/use-cart";
import type { CartItem } from "../interface/cart-item";

export interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addItem: (item: NewCartItem) => void;
  increaseItem: (id: number) => void;
  decreaseItem: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);
