import type { User, Review } from "../interface/user";

/** Loads all reviews of a user. */
export async function getReviews(user: User): Promise<Review[]> {
  return user.reviews ?? [];
}