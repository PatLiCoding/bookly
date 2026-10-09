import type { AdminBook, BookInput } from "../services/admin-service";

/** All form fields as strings, as typed into the inputs. */
export interface BookFormValues {
  title: string;
  author: string;
  category: string;
  price: string;
  cover: string;
  release_date: string;
  description: string;
}

export type ChangeField = (field: keyof BookFormValues, value: string) => void;

const EMPTY: BookFormValues = {
  title: "",
  author: "",
  category: "",
  price: "",
  cover: "",
  release_date: "",
  description: "",
};

/** Form values for an existing book, or an empty form for a new one. */
export function toFormValues(book: AdminBook | null): BookFormValues {
  if (!book) return EMPTY;
  return {
    title: book.title,
    author: book.author,
    category: book.category,
    price: String(book.price),
    cover: book.cover ?? "",
    release_date: book.release_date ?? "",
    description: book.description ?? "",
  };
}

/** Database payload from form values (empty optional fields become null). */
export function toBookInput(v: BookFormValues): BookInput {
  return {
    title: v.title.trim(),
    author: v.author.trim(),
    category: v.category.trim(),
    price: Number(v.price),
    cover: v.cover.trim() || null,
    release_date: v.release_date || null,
    description: v.description.trim() || null,
  };
}
