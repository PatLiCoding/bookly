/**
 * Renders a 5-star visual representation of a rating value as JSX elements.
 * Only full stars are filled (e.g., a rating of 3.5 fills exactly 3 stars).
 *
 * @param rating - The numerical rating value.
 * @returns An array of JSX `<span>` elements representing filled and empty star icons.
 */
export function renderStars(rating: number) {
  const filled = Math.floor(rating);
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < filled ? "filled" : ""}`}>
      ★
    </span>
  ));
}