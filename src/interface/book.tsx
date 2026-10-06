/**
 * Represents a user comment or basic rating entry.
 */
export interface Comment {
  /** Unique identifier for the comment. */
  id: string | number;
  /** Display name of the user who posted the comment. */
  userName: string;
  /** Numeric rating score (e.g., 1 to 5 stars). */
  rating: number;
  /** Text content of the comment. */
  text: string;
}

/**
 * Represents a book entity with store metadata, pricing, and aggregate rating metrics.
 */
export interface Book {
  /** Unique numeric book ID. */
  id: number;
  /** Title of the book. */
  title: string;
  /** Author name. */
  author: string;
  /** Formatted price string (e.g., "19,99 €"). */
  price: string;
  /** Average star rating score. */
  rating: number;
  /** Total count of submitted reviews. */
  reviewCount: number;
  /** Optional URL path to the cover image. */
  cover?: string | null;
  /** Category or genre slug. */
  category: string;
  /** Optional release/publication date string. */
  releaseDate?: string;
  /** Optional detailed book summary or synopsis. */
  description?: string;
}

/**
 * Base representation of a book excluding computed rating aggregates.
 */
export type BookBase = Omit<Book, "rating" | "reviewCount">;