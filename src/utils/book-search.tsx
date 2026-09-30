import type { Book } from "../interface/book";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toTerms(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean);
}

export function matchesQuery(text: string, query: string): boolean {
  const haystack = normalize(text);
  return toTerms(query).every((term) => haystack.includes(term));
}

export function searchBooks(books: Book[], query: string): Book[] {
  const terms = toTerms(query);
  if (terms.length === 0) return books;
  return books.filter((book) => {
    const text = normalize(`${book.title} ${book.author}`);
    return terms.every((term) => text.includes(term));
  });
}
