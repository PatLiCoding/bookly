import { Component } from "react";
import { Link } from "react-router-dom";
import type { Review } from "../../interface/review";
import { renderStars } from "../../utils/render-stars";

/** Props for the ReviewListItem component. */
interface ReviewListItemProps {
  /** Review data object containing book information, rating, date, and body text. */
  review: Review;
  /** Optional edit action handler. Hides edit button if omitted. */
  onEdit?: () => void;
  /** Optional delete action handler. Hides delete button if omitted. */
  onDelete?: () => void;
}

/**
 * Class component rendering a user review item in a list with optional edit and delete actions.
 */
export class ReviewListItem extends Component<ReviewListItemProps> {
  /** Renders action buttons for edit and delete operations when handlers are supplied. */
  private renderActions() {
    const { onEdit, onDelete } = this.props;
    if (!onEdit && !onDelete) return null;
    return (
      <div className="review-actions">
        {onEdit && (
          <button className="review-action-btn" onClick={onEdit}>
            Bearbeiten
          </button>
        )}
        {onDelete && (
          <button className="review-action-btn" onClick={onDelete}>
            Löschen
          </button>
        )}
      </div>
    );
  }

  render() {
    const { review } = this.props;
    return (
      <div className="review-item">
        <div className="review-item-header">
          <Link to={`/book/${review.bookId}`} className="review-book-link">
            <p className="review-book-title">{review.bookTitle}</p>
            <p className="review-book-author">{review.author}</p>
          </Link>
          <div className="review-meta">
            <span className="stars">{renderStars(review.rating)}</span>
            <span className="review-date">{review.date}</span>
          </div>
        </div>
        <p className="review-text">{review.text}</p>
        {this.renderActions()}
      </div>
    );
  }
}
