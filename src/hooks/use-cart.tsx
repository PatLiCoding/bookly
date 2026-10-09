import { useEffect, useState } from "react";
import type { CartItem } from "../interface/cart-item";
import { findMissingBookIds } from "../services/book-service";

/**
 * Type helper for adding a new item to the cart without requiring an initial quantity property.
 */
export type NewCartItem = Omit<CartItem, "quantity">;

/** LocalStorage key used to persist cart state across sessions. */
const STORAGE_KEY = "bookly-cart";

/**
 * Reads and parses saved cart items from `localStorage`.
 * Gracefully falls back to an empty array on parse errors or missing data.
 *
 * @returns An array of saved `CartItem` objects or an empty array.
 */
function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

/**
 * Persists current cart items to `localStorage`.
 * Fails silently if storage access is restricted or unavailable.
 *
 * @param items - The current list of cart items to save.
 */
function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* cart just won't survive a reload */
  }
}

/**
 * Adjusts the quantity of a specific cart item line by a delta value.
 * Lines where the resulting quantity drops to 0 or below are automatically removed.
 *
 * @param items - The current list of cart items.
 * @param id - The unique ID of the target cart item.
 * @param delta - The amount to change the quantity by (+1 or -1).
 * @returns A new array of updated cart items.
 */
function changeQuantity(items: CartItem[], id: number, delta: number): CartItem[] {
  return items
    .map((line) =>
      line.id === id ? { ...line, quantity: line.quantity + delta } : line,
    )
    .filter((line) => line.quantity > 0);
}

/**
 * Adds a new item to the cart with quantity 1, or increments the quantity if the item already exists.
 *
 * @param items - The current list of cart items.
 * @param item - The new item definition to add.
 * @returns A new array of updated cart items.
 */
function addToLines(items: CartItem[], item: NewCartItem): CartItem[] {
  if (items.some((line) => line.id === item.id)) {
    return changeQuantity(items, item.id, 1);
  }
  return [...items, { ...item, quantity: 1 }];
}

/**
 * Custom React hook for managing shopping cart state and persistence in `localStorage`.
 *
 * @returns An object exposing the current `cartItems` and actions to mutate the cart:
 * - `addItem`: Adds a item or increments its quantity.
 * - `increaseItem`: Increments quantity by 1.
 * - `decreaseItem`: Decrements quantity by 1 (removes line if quantity hits 0).
 * - `removeItem`: Completely removes a line by ID.
 * - `clearCart`: Resets the cart to an empty state.
 */
export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  useEffect(() => saveCart(cartItems), [cartItems]);

  useEffect(() => {
    async function validateCart() {
      if (cartItems.length === 0) return;
      const ids = cartItems.map((item) => item.id);
      const missing = await findMissingBookIds(ids);
      if (missing.length > 0) {
        setCartItems((prev) => prev.filter((item) => !missing.includes(item.id)));
      }
    }
    validateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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