import { supabase } from "../lib/supabase";
import { getAllBookStats, getBookStats, NO_STATS } from "./review-service";
import { sortBooks } from "../utils/book-filter";
import { ALL_CATEGORY } from "../utils/category";
import { formatPrice } from "../utils/price";
import { getCover } from "../utils/book-cover";
import type { Book, BookBase } from "../interface/book";
import type { BookStats } from "./review-service";

/** One row of the table "books". */
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

/** "2024-04-12" -> "12.04.2024" */
function formatDate(date: string | null): string | undefined {
  return date ? date.split("-").reverse().join(".") : undefined;
}

/** Turns a database row into a BookBase (price text, date, cover fallback). */
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

function withStats(book: BookBase, stats: Map<number, BookStats>): Book {
  return { ...book, ...(stats.get(book.id) ?? NO_STATS) };
}

async function fetchRows(): Promise<BookRow[]> {
  const { data, error } = await supabase.from("books").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getBooks(): Promise<Book[]> {
  const [rows, stats] = await Promise.all([fetchRows(), getAllBookStats()]);
  return rows.map(mapBook).map((book) => withStats(book, stats));
}

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

export async function getBooksByCategory(category?: string): Promise<Book[]> {
  const books = await getBooks();
  if (category === ALL_CATEGORY) return books;
  return books.filter((book) => book.category === category);
}

export async function getTopRatedBooks(limit: number): Promise<Book[]> {
  return sortBooks(await getBooks(), "rating").slice(0, limit);
}

export async function getNewestBooks(limit: number): Promise<Book[]> {
  return sortBooks(await getBooks(), "newest").slice(0, limit);
}