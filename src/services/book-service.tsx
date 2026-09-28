import { highlightBooks } from "../data/book-dummy-data";
import type { Book } from "../interface/book";

/** Finds a book by its id. Replace with a backend request later. */
export function getBookById(id: number): Book | undefined {
  return highlightBooks.find((book) => book.id === id);
}