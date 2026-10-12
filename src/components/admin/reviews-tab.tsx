import { useState } from "react";
import usePagedList from "../../hooks/use-paged-list";
import { deleteReview, fetchReviews, type AdminReview } from "../../services/admin-service";
import AdminList from "./admin-list";
import AdminMessageDialog, { type DialogConfig } from "./admin-dialog-modal";

interface RowProps {
  review: AdminReview;
  onDelete: (id: number) => void;
}

/**
 * Renders a single review row containing book details, rating, and delete button.
 */
function ReviewRow({ review, onDelete }: RowProps) {
  const date = new Date(review.created_at).toLocaleDateString("de-DE");
  return (
    <>
      <div className="admin-row-main">
        <strong>{review.books?.title ?? "Unbekannt"} · {"★".repeat(review.rating)}</strong>
        <span>{review.user_name} · {date}</span>
        {review.text && <p className="admin-review-text">{review.text}</p>}
      </div>
      <button className="admin-delete-btn" onClick={() => onDelete(review.id)}>Löschen</button>
    </>
  );
}

/**
 * Admin tab for viewing and deleting user reviews using custom modal dialogs.
 */
export default function ReviewsTab({ term }: { term: string }) {
  const list = usePagedList(fetchReviews, term);
  const [dialog, setDialog] = useState<DialogConfig | null>(null);

  /** Prompts confirmation dialog and deletes the selected review. */
  const confirmDelete = (id: number) => {
    setDialog({
      title: "Bewertung löschen", message: "Bewertung wirklich löschen?", confirmLabel: "Löschen", isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteReview(id);
          list.setItems((prev) => prev.filter((r) => r.id !== id));
        } catch {
          setDialog({ title: "Fehler", message: "Bewertung konnte nicht gelöscht werden." });
        }
      },
    });
  };

  return (
    <>
      <AdminList list={list} renderItem={(r) => <ReviewRow review={r} onDelete={confirmDelete} />} />
      {dialog && <AdminMessageDialog {...dialog} onClose={() => setDialog(null)} />}
    </>
  );
}