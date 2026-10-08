import type { MouseEvent } from "react";
import type { Book } from "../interface/book";
import { useCartContext } from "../context/use-cart-context";
import { parsePrice } from "../utils/parse-price";
import { getCover } from "../utils/book-cover";

/** Click handler for buttons placed inside a link. */
export type ClickHandler = (event: MouseEvent) => void;

/**
 * Wraps an action so the surrounding link does not navigate on click.
 *
 * @param action - Action to run after navigation was prevented.
 */
function guarded(action: () => void): ClickHandler {
  return (event) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };
}

/** Maps a book to the item shape expected by the cart. */
function toCartItem(book: Book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    price: parsePrice(book.price),
    cover: getCover(book.cover),
  };
}

/**
 * Provides the cart quantity of a book and link-safe cart actions.
 *
 * @param book - Book to manage in the cart.
 */
export function useBookCart(book: Book) {
  const { cartItems, addItem, increaseItem, decreaseItem } = useCartContext();
  const inCart = cartItems.find((item) => item.id === book.id);

  return {
    quantity: inCart?.quantity ?? 0,
    onAdd: guarded(() => addItem(toCartItem(book))),
    onIncrease: guarded(() => increaseItem(book.id)),
    onDecrease: guarded(() => decreaseItem(book.id)),
  };
}