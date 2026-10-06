/**
 * Detailed book review entity associated with both a specific book and authoring user.
 */
export interface Review {
  /** Unique review ID. */
  id: number;
  /** Reference ID of the target book. */
  bookId: number;
  /** Title of the target book at review creation. */
  bookTitle: string;
  /** Author name of the target book. */
  author: string;
  /** Unique ID of the reviewing user. */
  userId: string;
  /** Display name of the reviewing user. */
  userName: string;
  /** Star rating score awarded (1 to 5). */
  rating: number;
  /** Formatted date string when the review was posted. */
  date: string;
  /** Body text content of the review. */
  text: string;
}