/**
 * Represents an item entry stored inside the user's shopping cart.
 */
export interface CartItem {
  /** Unique numeric item or book ID. */
  id: number;
  /** Title of the book item. */
  title: string;
  /** Author name. */
  author: string;
  /** Numeric unit price. */
  price: number;
  /** Quantity count of this item in the cart. */
  quantity: number;
  /** Optional URL path to the cover thumbnail image. */
  cover?: string;
}

/**
 * Payload type for adding a new item to the cart, omitting initial quantity.
 */
export type NewCartItem = Omit<CartItem, "quantity">;