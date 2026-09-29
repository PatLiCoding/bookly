import { books } from "../data/book-dummy-data";
import { getBookRating } from "./review-service";
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