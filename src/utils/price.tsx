export const SHIPPING_COST = 3.95;

interface PricedLine {
  price: number;
  quantity: number;
}

/** Formats a number as a German price, e.g. 12.9 -> "12,90 €". */
export function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",") + " €";
}

/** Sums up price × quantity of all lines. */
export function calcSubtotal(items: PricedLine[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/** Shipping is charged once per order; an empty cart costs nothing. */
export function calcShippingCost(items: PricedLine[]): number {
  return items.length > 0 ? SHIPPING_COST : 0;
}

/** Total incl. shipping, rounded to cents to avoid float errors. */
export function calcTotal(items: PricedLine[]): number {
  const total = calcSubtotal(items) + calcShippingCost(items);
  return Math.round(total * 100) / 100;
}