import { useCallback, useEffect, useState } from "react";
import type { Review } from "../interface/user";
import { getReviewsByBook } from "../services/review-service";

export function useBookReviews(bookId: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    getReviewsByBook(bookId).then((list) => {
      if (active) setReviews(list);
    });
    return () => {
      active = false;
    };
  }, [bookId, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { reviews, reload };
}
