/**
 * Standard shipping cost flat rate applied to non-empty orders.
 */
export const SHIPPING_COST = 3.95;

/**
 * Represents a line item in a cart or order that has a price and quantity.
 */
interface PricedLine {
  /** Unit price of the item. */
  price: number;
  /** Quantity of the item. */
  quantity: number;
}

/**
 * Formats a numeric price value into a localized German price string (e.g., 12.9 -> "12,90 €").
 *
 * @param value - The numeric price value to format.
 * @returns The formatted German price string.
 */
export function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",") + " €";
}

/**
 * Calculates the subtotal price for an array of priced line items.
 *
 * @param items - List of items with price and quantity.
 * @returns The calculated subtotal (sum of price multiplied by quantity for all items).
 */
export function calcSubtotal(items: PricedLine[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Determines the applicable shipping cost. Charged once if items exist; empty carts incur 0 cost.
 *
 * @param items - List of items in the cart or order.
 * @returns The shipping cost (`SHIPPING_COST` or `0`).
 */
export function calcShippingCost(items: PricedLine[]): number {
  return items.length > 0 ? SHIPPING_COST : 0;
}

/**
 * Calculates the grand total including shipping, rounded to two decimal places to prevent floating-point inaccuracies.
 *
 * @param items - List of line items in the cart or order.
 * @returns The total amount rounded to cents.
 */
export function calcTotal(items: PricedLine[]): number {
  const total = calcSubtotal(items) + calcShippingCost(items);
  return Math.round(total * 100) / 100;
}