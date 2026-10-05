import { supabase } from "../lib/supabase";
import type { Book } from "../interface/book";
import type { User } from "../interface/user";
import type { Review } from "../interface/review";

export interface ReviewInput {
  rating: number;
  text: string;
}

export interface BookStats {
  rating: number;
  reviewCount: number;
}

export const NO_STATS: BookStats = { rating: 0, reviewCount: 0 };

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

interface RatingRow {
  book_id: number;
  rating: number;
}

const SELECT = "*, books(title, author)";

export function isValidReview({ rating, text }: ReviewInput): boolean {
  return rating >= 1 && rating <= 5 && text.trim().length > 0;
}

/** ISO timestamp -> "12.04.2024" */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

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

/** Loads the reviews of a book or of a user, newest first. */
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

export function getReviewsByBook(bookId: number): Promise<Review[]> {
  return fetchReviews("book_id", bookId);
}

export function getReviewsByUser(userId: string): Promise<Review[]> {
  return fetchReviews("user_id", userId);
}

export function findUserReview(
  list: Review[],
  userId: string,
): Review | undefined {
  return list.find((r) => r.userId === userId);
}

export function averageRating(list: { rating: number }[]): number {
  if (list.length === 0) return 0;
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / list.length) * 10) / 10;
}

function toStats(list: { rating: number }[]): BookStats {
  return { rating: averageRating(list), reviewCount: list.length };
}

async function fetchRatings(bookId?: number): Promise<RatingRow[]> {
  const query = supabase.from("reviews").select("book_id, rating");
  const { data, error } = await (bookId ? query.eq("book_id", bookId) : query);
  if (error) throw error;
  return data as RatingRow[];
}

/** Average rating and count for one book. */
export async function getBookStats(bookId: number): Promise<BookStats> {
  return toStats(await fetchRatings(bookId));
}

/** Average rating and count for every book that has reviews. */
export async function getAllBookStats(): Promise<Map<number, BookStats>> {
  const grouped = new Map<number, RatingRow[]>();
  for (const row of await fetchRatings()) {
    grouped.set(row.book_id, [...(grouped.get(row.book_id) ?? []), row]);
  }
  return new Map([...grouped].map(([id, rows]) => [id, toStats(rows)] as const));
}

/** The unique constraint (one review per user and book) becomes a readable error. */
function reviewError(error: { code?: string; message: string }): Error {
  const taken = error.code === "23505";
  return new Error(taken ? "Bereits bewertet" : error.message);
}

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

export async function deleteReview(id: number, userId: string): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw reviewError(error);
}