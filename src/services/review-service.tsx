import { supabase } from "../lib/supabase";
import type { Book } from "../interface/book";
import type { User } from "../interface/user";
import type { Review } from "../interface/review";

/** Payload interface for creating or updating review content. */
export interface ReviewInput {
  /** Numerical rating value (1 to 5 stars). */
  rating: number;
  /** Text content of the written review. */
  text: string;
}

/** Statistical summary model holding aggregate rating info for a book. */
export interface BookStats {
  /** Average calculated rating score. */
  rating: number;
  /** Total count of submitted review ratings. */
  reviewCount: number;
}

/** Default zero-state statistics object when no reviews exist. */
export const NO_STATS: BookStats = { rating: 0, reviewCount: 0 };

/** Internal database representation row for review items joined with books. */
interface ReviewRow {
  id: number;
  book_id: number;
  user_id: string | null;
  user_name: string;
  rating: number;
  text: string | null;
  created_at: string;
  books: { title: string; author: string } | null;
}

/** Internal minimal row object for calculating rating statistics. */
interface RatingRow {
  book_id: number;
  rating: number;
}

const SELECT = "*, books(title, author)";

/**
 * Validates review input parameters (rating between 1 and 5, non-empty text content).
 *
 * @param input - Review submission input data.
 * @returns `true` if input parameters are valid, otherwise `false`.
 */
export function isValidReview({ rating, text }: ReviewInput): boolean {
  return rating >= 1 && rating <= 5 && text.trim().length > 0;
}

/**
 * Converts ISO date timestamp string into German date string representation (`DD.MM.YYYY`).
 *
 * @param iso - ISO timestamp string.
 * @returns Localized date string format.
 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Maps internal database review record to public domain {@link Review} entity model.
 *
 * @param row - Database row object.
 * @returns Formatted review entity model.
 */
function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    bookId: row.book_id,
    bookTitle: row.books?.title ?? "",
    author: row.books?.author ?? "",
    userId: row.user_id ?? "",
    userName: row.user_name,
    rating: row.rating,
    text: row.text ?? "",
    date: formatDate(row.created_at),
  };
}

/**
 * Fetches review rows filtered by specified column key and match value sorted by creation date descending.
 *
 * @param column - Database column name filter (`book_id` or `user_id`).
 * @param value - Search target ID value.
 * @returns List of review entities mapped to domain model.
 * @throws Database query error.
 */
async function fetchReviews(
  column: "book_id" | "user_id",
  value: number | string,
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(SELECT)
    .eq(column, value)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });
  if (error) throw error;
  return (data as ReviewRow[]).map(mapReview);
}

/**
 * Retrieves all submitted user reviews for a specific book.
 *
 * @param bookId - Unique book identifier.
 * @returns Promise resolving to review item list.
 */
export function getReviewsByBook(bookId: number): Promise<Review[]> {
  return fetchReviews("book_id", bookId);
}

/**
 * Retrieves all submitted reviews by a given user.
 *
 * @param userId - Unique user identifier string.
 * @returns Promise resolving to review item list.
 */
export function getReviewsByUser(userId: string): Promise<Review[]> {
  return fetchReviews("user_id", userId);
}

/**
 * Locates user's existing review entry within a given list of reviews.
 *
 * @param list - List of review models to evaluate.
 * @param userId - Active user identifier string.
 * @returns Found {@link Review} entity or `undefined` if none exists.
 */
export function findUserReview(
  list: Review[],
  userId: string,
): Review | undefined {
  return list.find((r) => r.userId === userId);
}

/**
 * Calculates rounded arithmetic average rating score for provided rating collection.
 *
 * @param list - Items list containing numerical rating values.
 * @returns Average rating score rounded to one decimal place, or `0` if empty.
 */
export function averageRating(list: { rating: number }[]): number {
  if (list.length === 0) return 0;
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / list.length) * 10) / 10;
}

/**
 * Computes aggregated statistics (average score and total count) from rating collection.
 *
 * @param list - Collection containing rating values.
 * @returns {@link BookStats} object with calculated metrics.
 */
function toStats(list: { rating: number }[]): BookStats {
  return { rating: averageRating(list), reviewCount: list.length };
}

/**
 * Fetches raw numerical ratings records from database for a single book or all books.
 *
 * @param bookId - Optional book ID parameter to filter results.
 * @returns List of rating row objects.
 * @throws Database query error.
 */
async function fetchRatings(bookId?: number): Promise<RatingRow[]> {
  const query = supabase.from("reviews").select("book_id, rating");
  const { data, error } = await (bookId ? query.eq("book_id", bookId) : query);
  if (error) throw error;
  return data as RatingRow[];
}

/**
 * Calculates aggregated review score and count for a single book ID.
 *
 * @param bookId - Target book identifier.
 * @returns Promise resolving to {@link BookStats} calculation.
 */
export async function getBookStats(bookId: number): Promise<BookStats> {
  return toStats(await fetchRatings(bookId));
}

/**
 * Calculates aggregated rating metrics for every book possessing reviews in database.
 *
 * @returns Map mapping book ID primary keys to their respective {@link BookStats}.
 */
export async function getAllBookStats(): Promise<Map<number, BookStats>> {
  const grouped = new Map<number, RatingRow[]>();
  for (const row of await fetchRatings()) {
    grouped.set(row.book_id, [...(grouped.get(row.book_id) ?? []), row]);
  }
  return new Map([...grouped].map(([id, rows]) => [id, toStats(rows)] as const));
}

/**
 * Translates PostgreSQL database constraint error codes into readable user messages.
 *
 * @param error - Database error exception object containing message and code.
 * @returns Localized error object.
 */
function reviewError(error: { code?: string; message: string }): Error {
  const taken = error.code === "23505";
  return new Error(taken ? "Bereits bewertet" : error.message);
}

/**
 * Inserts a new review entity into database storage associated with given book and user.
 *
 * @param book - Target book instance.
 * @param user - Authenticated author user instance.
 * @param input - Review rating and comment input payload.
 * @throws `Error` if payload is invalid or duplicate review entry exists.
 */
export async function addReview(
  book: Book,
  user: User,
  input: ReviewInput,
): Promise<void> {
  if (!isValidReview(input)) throw new Error("Ungültige Bewertung");
  const { error } = await supabase.from("reviews").insert({
    book_id: book.id,
    user_id: user.id,
    user_name: `${user.Firstname} ${user.Lastname}`.trim(),
    rating: input.rating,
    text: input.text.trim(),
  });
  if (error) throw reviewError(error);
}

/**
 * Updates content and rating parameters of an existing review in database storage.
 *
 * @param id - Primary key review ID.
 * @param userId - Authenticated user identifier (ensures ownership).
 * @param input - Updated rating and text details payload.
 * @throws `Error` if payload is invalid or update fails.
 */
export async function updateReview(
  id: number,
  userId: string,
  input: ReviewInput,
): Promise<void> {
  if (!isValidReview(input)) throw new Error("Ungültige Bewertung");
  const { error } = await supabase
    .from("reviews")
    .update({
      rating: input.rating,
      text: input.text.trim(),
      created_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw reviewError(error);
}

/**
 * Removes a user's review entry from database storage.
 *
 * @param id - Target review record identifier.
 * @param userId - Owner user ID enforcing authorization check.
 * @throws `Error` if deletion fails.
 */
export async function deleteReview(id: number, userId: string): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw reviewError(error);
}