import { books } from "../data/book-dummy-data";
import { getBookStats } from "./review-service";
import { sortBooks } from "../utils/book-filter";
import { ALL_CATEGORY } from "../utils/category";
import type { Book, BookBase } from "../interface/book";

function withStats(book: BookBase): Book {
  return { ...book, ...getBookStats(book.id) };
}

export function getBooks(): Book[] {
  return books.map(withStats);
}

export function getBookById(id: number): Book | undefined {
  const book = books.find((b) => b.id === id);
  return book && withStats(book);
}

export function getBooksByCategory(category?: string): Book[] {
  if (category === ALL_CATEGORY) return getBooks();
  return getBooks().filter((book) => book.category === category);
}

export function getTopRatedBooks(limit: number): Book[] {
  return sortBooks(getBooks(), "rating").slice(0, limit);
}

export function getNewestBooks(limit: number): Book[] {
  return sortBooks(getBooks(), "newest").slice(0, limit);
}