import { supabase } from "../lib/supabase";
import { getBookStats } from "./review-service";
import { sortBooks } from "../utils/book-filter";
import { ALL_CATEGORY } from "../utils/category";
import { formatPrice } from "../utils/price";
import { getCover } from "../utils/book-cover";
import type { Book, BookBase } from "../interface/book";

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

function withStats(book: BookBase): Book {
  return { ...book, ...getBookStats(book.id) };
}

function toBooks(rows: BookRow[] | null): Book[] {
  return (rows ?? []).map(mapBook).map(withStats);
}

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase.from("books").select("*");
  if (error) throw error;
  return toBooks(data);
}

export async function getBookById(id: number): Promise<Book | undefined> {
  if (Number.isNaN(id)) return undefined;
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? withStats(mapBook(data)) : undefined;
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