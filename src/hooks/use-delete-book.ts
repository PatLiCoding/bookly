import { useState } from "react";
import { deleteBook, type AdminBook } from "../services/admin-service";

/** Confirmation text that names the consequences of deleting a book. */
function confirmText(title: string): string {
  return (
    `„${title}“ wirklich löschen?\n\n` +
    "Alle Bewertungen zu diesem Buch werden ebenfalls gelöscht. " +
    "Das kann nicht rückgängig gemacht werden."
  );
}

/** Deletes the given book after confirmation; reports success via onDeleted. */
export default function useDeleteBook(
  book: AdminBook | null,
  onDeleted: (id: number) => void,
) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!book || !window.confirm(confirmText(book.title))) return;
    setDeleting(true);
    setError("");
    try {
      await deleteBook(book.id);
      onDeleted(book.id);
    } catch {
      setError("Löschen fehlgeschlagen. Bitte erneut versuchen.");
      setDeleting(false);
    }
  }

  return { deleting, error, remove };
}
