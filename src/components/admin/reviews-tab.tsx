import usePagedList from "../../hooks/use-paged-list";
import { deleteReview, fetchReviews, type AdminReview } from "../../services/admin-service";
import AdminList from "./admin-list";

interface RowProps {
  review: AdminReview;
  onDelete: (id: number) => void;
}

/** One review: book, stars, author, text and delete button. */
function ReviewRow({ review, onDelete }: RowProps) {
  const date = new Date(review.created_at).toLocaleDateString("de-DE");
  return (
    <>
      <div className="admin-row-main">
        <strong>{review.books?.title ?? "Unbekanntes Buch"} · {"★".repeat(review.rating)}</strong>
        <span>{review.user_name} · {date}</span>
        {review.text && <p className="admin-review-text">{review.text}</p>}
      </div>
      <button className="admin-delete-btn" onClick={() => onDelete(review.id)}>
        Löschen
      </button>
    </>
  );
}

/** Reviews tab: paged, searchable list; admins can delete reviews. */
export default function ReviewsTab({ term }: { term: string }) {
  const list = usePagedList(fetchReviews, term);

  async function remove(id: number) {
    if (!window.confirm("Bewertung wirklich löschen?")) return;
    try {
      await deleteReview(id);
      list.setItems((prev) => prev.filter((r) => r.id !== id));
    } catch {
      window.alert("Bewertung konnte nicht gelöscht werden.");
    }
  }

  return (
    <AdminList list={list} renderItem={(r) => <ReviewRow review={r} onDelete={remove} />} />
  );
}