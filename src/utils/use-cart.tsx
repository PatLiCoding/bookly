import { useEffect, useState } from "react";
import type { CartItem } from "../pages/cart-page/cart-page";

export type NewCartItem = Omit<CartItem, "quantity">;

const STORAGE_KEY = "bookly-cart";

/** Reads the saved cart; falls back to an empty cart on any error. */
function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

/** Saves the cart; ignores errors (e.g. storage disabled). */
function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* cart just won't survive a reload */
  }
}

/** Changes the quantity of one line; lines with quantity <= 0 are dropped. */
function changeQuantity(items: CartItem[], id: number, delta: number): CartItem[] {
  return items
    .map((line) =>
      line.id === id ? { ...line, quantity: line.quantity + delta } : line,
    )
    .filter((line) => line.quantity > 0);
}

/** Adds one piece of a book or creates a new cart line. */
function addToLines(items: CartItem[], item: NewCartItem): CartItem[] {
  if (items.some((line) => line.id === item.id)) {
    return changeQuantity(items, item.id, 1);
  }
  return [...items, { ...item, quantity: 1 }];
}

/** Manages all shopping cart actions. */
export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  useEffect(() => saveCart(cartItems), [cartItems]);

  const addItem = (item: NewCartItem) =>
    setCartItems((prev) => addToLines(prev, item));
  const increaseItem = (id: number) =>
    setCartItems((prev) => changeQuantity(prev, id, 1));
  const decreaseItem = (id: number) =>
    setCartItems((prev) => changeQuantity(prev, id, -1));
  const removeItem = (id: number) =>
    setCartItems((prev) => prev.filter((line) => line.id !== id));
  const clearCart = () => setCartItems([]);

  return { cartItems, addItem, increaseItem, decreaseItem, removeItem, clearCart };
}