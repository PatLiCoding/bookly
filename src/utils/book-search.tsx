import type { Book } from "../interface/book";

/**
 * Normalizes text for search indexing and comparison by converting it to lowercase,
 * decomposing diacritics (NFD), and stripping accent marks.
 *
 * @param text - The raw string to normalize.
 * @returns The normalized, accent-free, lowercase string.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Normalizes a search query string and splits it into individual search terms.
 *
 * @param query - The raw user input search query string.
 * @returns An array of non-empty search terms.
 */
function toTerms(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean);
}

/**
 * Checks whether a given string contains all search terms from a query string,
 * ignoring casing and accent marks.
 *
 * @param text - The target text string to search within.
 * @param query - The search query containing one or more terms.
 * @returns `true` if all query terms are found in `text`, otherwise `false`.
 */
export function matchesQuery(text: string, query: string): boolean {
  const haystack = normalize(text);
  return toTerms(query).every((term) => haystack.includes(term));
}

/**
 * Searches a collection of books by matching query terms against book titles and authors.
 * Performs normalized substring matching for each term in the query.
 *
 * @param books - The array of books to search through.
 * @param query - The search query string.
 * @returns An array of matching books, or the full list if the query is empty.
 */
export function searchBooks(books: Book[], query: string): Book[] {
  const terms = toTerms(query);
  if (terms.length === 0) return books;
  return books.filter((book) => {
    const text = normalize(`${book.title} ${book.author}`);
    return terms.every((term) => text.includes(term));
  });
}