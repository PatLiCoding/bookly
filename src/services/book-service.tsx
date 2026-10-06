import { supabase } from "../lib/supabase";
import { getAllBookStats, getBookStats, NO_STATS } from "./review-service";
import { sortBooks } from "../utils/book-filter";
import { ALL_CATEGORY } from "../utils/category";
import { formatPrice } from "../utils/price";
import { getCover } from "../utils/book-cover";
import type { Book, BookBase } from "../interface/book";
import type { BookStats } from "./review-service";

/** Represents a single raw database record row from the `books` table. */
interface BookRow {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string | null;
  category: string;
  release_date: string | null;
  description: string | null;
}

/**
 * Converts ISO date strings (`YYYY-MM-DD`) into formatted German date format (`DD.MM.YYYY`).
 *
 * @param date - The raw date string or `null`.
 * @returns Formatted date string or `undefined`.
 */
function formatDate(date: string | null): string | undefined {
  return date ? date.split("-").reverse().join(".") : undefined;
}

/**
 * Transforms a raw database book row into a normalized {@link BookBase} object.
 *
 * @param row - Database row object.
 * @returns Normalized domain entity representation.
 */
function mapBook(row: BookRow): BookBase {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    price: formatPrice(row.price),
    cover: getCover(row.cover),
    category: row.category,
    releaseDate: formatDate(row.release_date),
    description: row.description ?? undefined,
  };
}

/**
 * Merges base book properties with review stats rating aggregates.
 *
 * @param book - Target base book model instance.
 * @param stats - Map mapping book IDs to their aggregated statistics.
 * @returns Combined {@link Book} model entity.
 */
function withStats(book: BookBase, stats: Map<number, BookStats>): Book {
  return { ...book, ...(stats.get(book.id) ?? NO_STATS) };
}

/**
 * Fetches all raw book entries from Supabase database storage.
 *
 * @returns List of database row records.
 */
async function fetchRows(): Promise<BookRow[]> {
  const { data, error } = await supabase.from("books").select("*");
  if (error) throw error;
  return data ?? [];
}

/**
 * Fetches all available books combined with review ratings and statistics.
 *
 * @returns Promise resolving to a list of fully populated {@link Book} models.
 */
export async function getBooks(): Promise<Book[]> {
  const [rows, stats] = await Promise.all([fetchRows(), getAllBookStats()]);
  return rows.map(mapBook).map((book) => withStats(book, stats));
}

/**
 * Retrieves a single book by ID along with its review statistics.
 *
 * @param id - Unique identifier of book record.
 * @returns Promise resolving to book entity or `undefined` if missing or invalid ID.
 */
export async function getBookById(id: number): Promise<Book | undefined> {
  if (Number.isNaN(id)) return undefined;
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  return { ...mapBook(data), ...(await getBookStats(id)) };
}

/**
 * Retrieves list of books belonging to a specific category.
 *
 * @param category - Category filter identifier string.
 * @returns Promise resolving to list of matched books.
 */
export async function getBooksByCategory(category?: string): Promise<Book[]> {
  const books = await getBooks();
  if (category === ALL_CATEGORY) return books;
  return books.filter((book) => book.category === category);
}

/**
 * Retrieves top rated books sorted by average review rating.
 *
 * @param limit - Max number of books returned.
 * @returns Top rated book list capped by limit parameter.
 */
export async function getTopRatedBooks(limit: number): Promise<Book[]> {
  return sortBooks(await getBooks(), "rating").slice(0, limit);
}

/**
 * Retrieves newest book releases sorted by release date.
 *
 * @param limit - Max number of items returned.
 * @returns Latest released book list capped by limit parameter.
 */
export async function getNewestBooks(limit: number): Promise<Book[]> {
  return sortBooks(await getBooks(), "newest").slice(0, limit);
}