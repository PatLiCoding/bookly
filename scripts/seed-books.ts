import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { books } from "../src/data/book-dummy-data";
import type { BookBase } from "../src/interface/book";

config({ path: ".env" });

/**
 * Initialized Supabase client instance using service role credentials for administrative tasks.
 */
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * Parses a German formatted price string (e.g. "14,99 €") into a numeric float representation (14.99).
 *
 * @param price - The formatted price string.
 * @returns The parsed numeric price.
 */
const parsePrice = (price: string): number =>
  parseFloat(price.replace(",", ".").replace(/[^\d.]/g, ""));

/**
 * Converts a date string in "DD.MM.YYYY" format to ISO format "YYYY-MM-DD" suitable for database insertion.
 * Returns `null` if no date is provided.
 *
 * @param date - The optional date string in "DD.MM.YYYY" format.
 * @returns The ISO date string ("YYYY-MM-DD") or `null`.
 */
const parseDate = (date?: string): string | null =>
  date ? date.split(".").reverse().join("-") : null;

/**
 * Converts a `BookBase` object into a database table row object compatible with the Supabase schema.
 *
 * @param book - The input book dummy item.
 * @returns An object formatted for table insertion into the "books" table.
 */
function toRow(book: BookBase) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    price: parsePrice(book.price),
    cover: null,
    category: book.category,
    release_date: parseDate(book.releaseDate),
    description: book.description,
  };
}

/**
 * Moves the id counter of "books" behind the highest seeded id, so books
 * created later get a free id (see `sync_books_id_seq` in supabase/schema.sql).
 */
async function syncIdSequence() {
  const { error } = await supabase.rpc("sync_books_id_seq");
  if (error) {
    console.error("Fehler beim Aktualisieren der ID-Sequenz:", error.message);
    process.exit(1);
  }
}

/**
 * Asynchronously seeds the database by uploading all dummy books into the "books" Supabase table.
 * Uses upsert, so the script can safely be run more than once.
 * Exits the process with status code 1 if an error occurs.
 */
async function seed() {
  const { error } = await supabase.from("books").upsert(books.map(toRow));
  if (error) {
    console.error("Fehler:", error.message, error.details, error.hint);
    process.exit(1);
  }
  await syncIdSequence();
  console.log(`${books.length} Bücher eingefügt`);
}

seed();
