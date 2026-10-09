import { useState, type FormEvent } from "react";
import {
  createBook,
  updateBook,
  type AdminBook,
  type BookListItem,
} from "../services/admin-service";
import {
  toBookInput,
  toFormValues,
  type BookFormValues,
} from "../utils/book-form";

/** Form values and a change handler for single fields. */
function useBookValues(book: AdminBook | null) {
  const [values, setValues] = useState(() => toFormValues(book));
  const change = (field: keyof BookFormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));
  return { values, change };
}

/** Updates the given book, or creates a new one if there is none. */
function saveBook(
  book: AdminBook | null,
  values: BookFormValues,
): Promise<BookListItem> {
  const input = toBookInput(values);
  return book ? updateBook(book.id, input) : createBook(input);
}

/** Submit handler with saving and error state. */
function useSaveBook(
  book: AdminBook | null,
  values: BookFormValues,
  onSaved: (saved: BookListItem) => void,
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      onSaved(await saveBook(book, values));
    } catch {
      setError("Save failed. Please try again.");
      setSaving(false);
    }
  }

  return { saving, error, submit };
}

/** State and submit logic of the book dialog (create and edit). */
export default function useBookForm(
  book: AdminBook | null,
  onSaved: (saved: BookListItem) => void,
) {
  const { values, change } = useBookValues(book);
  const save = useSaveBook(book, values, onSaved);
  return { values, change, ...save };
}
