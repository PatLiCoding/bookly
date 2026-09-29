import { initialReviews } from "../data/review-dummy-data";
import type { Book } from "../interface/book";
import type { Review, User } from "../interface/user";

export interface ReviewInput {
  rating: number;
  text: string;
}

let reviews: Review[] = [...initialReviews];

export function isValidReview({ rating, text }: ReviewInput): boolean {
  return rating >= 1 && rating <= 5 && text.trim().length > 0;
}

function dateValue(date: string): number {
  const [day, month, year] = date.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function sortNewestFirst(list: Review[]): Review[] {
  return [...list].sort(
    (a, b) => dateValue(b.date) - dateValue(a.date) || b.id - a.id,
  );
}

export async function getReviewsByBook(bookId: number): Promise<Review[]> {
  return sortNewestFirst(reviews.filter((r) => r.bookId === bookId));
}

export async function getReviewsByUser(userId: number): Promise<Review[]> {
  return sortNewestFirst(reviews.filter((r) => r.userId === userId));
}

export function findUserReview(
  list: Review[],
  userId: number,
): Review | undefined {
  return list.find((r) => r.userId === userId);
}

export function averageRating(list: Review[]): number {
  if (list.length === 0) return 0;
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / list.length) * 10) / 10;
}

export function getBookRating(bookId: number): number {
  return averageRating(reviews.filter((r) => r.bookId === bookId));
}

function today(): string {
  return new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildReview(book: Book, user: User, input: ReviewInput): Review {
  return {
    id: Date.now(),
    bookId: book.id,
    bookTitle: book.title,
    author: book.author,
    userId: user.id,
    userName: `${user.Firstname} ${user.Lastname}`,
    rating: input.rating,
    text: input.text.trim(),
    date: today(),
  };
}

export async function addReview(
  book: Book,
  user: User,
  input: ReviewInput,
): Promise<Review> {
  const ofBook = reviews.filter((r) => r.bookId === book.id);
  if (findUserReview(ofBook, user.id)) throw new Error("Bereits bewertet");
  if (!isValidReview(input)) throw new Error("Ungültige Bewertung");
  const review = buildReview(book, user, input);
  reviews = [review, ...reviews];
  return review;
}

export async function updateReview(
  id: number,
  userId: number,
  input: ReviewInput,
): Promise<void> {
  if (!isValidReview(input)) throw new Error("Ungültige Bewertung");
  reviews = reviews.map((r) =>
    r.id === id && r.userId === userId
      ? { ...r, rating: input.rating, text: input.text.trim(), date: today() }
      : r,
  );
}

export async function deleteReview(id: number, userId: number): Promise<void> {
  reviews = reviews.filter((r) => !(r.id === id && r.userId === userId));
}