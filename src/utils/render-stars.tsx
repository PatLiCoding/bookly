/** Renders 5 stars; only full stars are filled (3.5 fills 3 stars). */
export function renderStars(rating: number) {
  const filled = Math.floor(rating);
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < filled ? "filled" : ""}`}>
      ★
    </span>
  ));
}