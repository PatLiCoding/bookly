import { useCallback, useEffect, useState } from "react";
import type { Review } from "../interface/review";
import { getReviewsByBook } from "../services/review-service";

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
