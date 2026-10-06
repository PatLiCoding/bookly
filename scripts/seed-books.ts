import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { books } from "../src/data/book-dummy-data";
import type { BookBase } from "../src/interface/book";

config({ path: ".env" });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/** "14,99 €" -> 14.99 */
const parsePrice = (price: string): number =>
  parseFloat(price.replace(",", ".").replace(/[^\d.]/g, ""));

/** "12.04.2024" -> "2024-04-12", undated -> null */
const parseDate = (date?: string): string | null =>
  date ? date.split(".").reverse().join("-") : null;

/** Converts a dummy book into a database row. */
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

/** Loads all dummy books into the "books" table. */
async function seed() {
  const { error } = await supabase.from("books").insert(books.map(toRow));
  if (error) {
    console.error("Fehler:", error.message, error.details, error.hint);
    process.exit(1);
  }
  console.log(`${books.length} Bücher eingefügt`);
}

seed();
