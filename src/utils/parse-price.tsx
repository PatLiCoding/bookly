/** Converts a formatted price string (e.g., "€12.99") into a number. */
export function parsePrice(price: string): number {
  const normalized = price.replace(/[^\d,.-]/g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isNaN(value) ? 0 : value;
}
