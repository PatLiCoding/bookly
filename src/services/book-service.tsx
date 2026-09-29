import { books } from "../data/book-dummy-data";
import { getBookRating } from "./review-service";
import { dateValue } from "../utils/date";
import type { Book, BookBase } from "../interface/book";

function withRating(book: BookBase): Book {
  return { ...book, rating: getBookRating(book.id) };
}

export function getBooks(): Book[] {
  return books.map(withRating);
}

export function getBookById(id: number): Book | undefined {
  const book = books.find((b) => b.id === id);
  return book && withRating(book);
}

export function getTopRatedBooks(limit: number): Book[] {
  return getBooks()
    .sort(
      (a, b) =>
        b.rating - a.rating ||
        dateValue(b.releaseDate) - dateValue(a.releaseDate),
    )
    .slice(0, limit);
}

export function getNewestBooks(limit: number): Book[] {
  return getBooks()
    .sort((a, b) => dateValue(b.releaseDate) - dateValue(a.releaseDate))
    .slice(0, limit);
}