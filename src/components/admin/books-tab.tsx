import usePagedList from "../../hooks/use-paged-list";
import { fetchBooks, type AdminBook } from "../../services/admin-service";
import AdminList from "./admin-list";

/** One book: title, author, category and price (read-only). */
function BookRow({ book }: { book: AdminBook }) {
  return (
    <>
      <div className="admin-row-main">
        <strong>{book.title}</strong>
        <span>{book.author} · {book.category}</span>
      </div>
      <span>{Number(book.price).toFixed(2)} €</span>
    </>
  );
}

/** Books tab: paged, searchable, read-only list of all books. */
export default function BooksTab({ term }: { term: string }) {
  const list = usePagedList(fetchBooks, term);
  return <AdminList list={list} renderItem={(b) => <BookRow book={b} />} />;
}