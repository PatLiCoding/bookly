/** Renders 5 stars; the first `rating` stars are marked as filled. */
export function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
      ★
    </span>
  ));
}