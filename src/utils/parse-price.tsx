/**
 * Parses a formatted price string into a numeric value, stripping currency symbols and normalizing commas.
 * If parsing fails or yields `NaN`, returns `0`.
 *
 * @param price - The formatted price string (e.g., "€12.99", "12,99 €", "-5.50").
 * @returns The parsed numeric price value, or `0` if the string cannot be parsed.
 */
export function parsePrice(price: string): number {
  const normalized = price.replace(/[^\d,.-]/g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isNaN(value) ? 0 : value;
}
