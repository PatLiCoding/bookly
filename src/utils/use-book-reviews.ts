import { useCallback, useEffect, useState } from "react";
import type { Review } from "../interface/review";
import { getReviewsByBook } from "../services/review-service";

/**
 * Custom React hook that handles fetching, loading state, and re-fetching
 * of reviews for a specific book ID.
 *
 * @param bookId - The unique identifier of the book whose reviews should be loaded.
 * @returns An object containing:
 * - `reviews`: Array of loaded `Review` objects.
 * - `loaded`: Boolean indicating whether reviews have completed initial loading.
 * - `reload`: Callback function to trigger a fresh re-fetch of the reviews.
 */
export function useBookReviews(bookId: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    getReviewsByBook(bookId).then((list) => {
      if (!active) return;
      setReviews(list);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [bookId, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { reviews, loaded, reload };
}
