import { useState } from "react";
import usePagedList from "../../hooks/use-paged-list";
import {fetchBook, fetchBooks, type AdminBook, type BookListItem,} from "../../services/admin-service";
import AdminList from "./admin-list";
import BookDialog from "./book-dialog";

/** Represents dialog state: closed (null), creation ({ book: null }), or editing ({ book }). */
type DialogState = { book: AdminBook | null } | null;

/** Replaces an edited book within the array or prepends a newly created book. */
function upsertBook(books: BookListItem[], saved: BookListItem): BookListItem[] {
  const exists = books.some((b) => b.id === saved.id);
  return exists ? books.map((b) => (b.id === saved.id ? saved : b)) : [saved, ...books];
}

interface RowProps {
  book: BookListItem;
  onEdit: (book: BookListItem) => void;
}

/** Renders a single book entry showing title, author, category, and price; clicking opens the edit dialog. */
function BookRow({ book, onEdit }: RowProps) {
  return (
    <button type="button" className="admin-row-btn" title="Bearbeiten" onClick={() => onEdit(book)}>
      <span className="admin-row-main">
        <strong>
          {book.title}
          {book.hidden && <span className="admin-badge">Ausgeblendet</span>}
        </strong>
        <span>{book.author} · {book.category}</span>
      </span>
      <span>{Number(book.price).toFixed(2)} €</span>
    </button>
  );
}

/** Renders the Books tab featuring a paginated, searchable list with options to add or edit books. */
export default function BooksTab({ term }: { term: string }) {
  const list = usePagedList(fetchBooks, term);
  const [dialog, setDialog] = useState<DialogState>(null);

  async function openEdit(item: BookListItem) {
    try {
      setDialog({ book: await fetchBook(item.id) });
    } catch {
      window.alert("Das Buch konnte nicht geladen werden.");
    }
  }

  function handleSaved(saved: BookListItem) {
    list.setItems((prev) => upsertBook(prev, saved));
    setDialog(null);
  }

  return (
    <>
      <div className="admin-toolbar">
        <button className="admin-add-btn" onClick={() => setDialog({ book: null })}>
          + Buch hinzufügen
        </button>
      </div>
      <AdminList list={list} renderItem={(b) => <BookRow book={b} onEdit={openEdit} />} />
      {dialog && (
        <BookDialog
          book={dialog.book}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}