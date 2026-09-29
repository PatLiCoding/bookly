import { Component } from "react";
import { Link } from "react-router-dom";
import type { Review } from "../../interface/user";
import { renderStars } from "../../utils/render-stars";

interface ReviewListItemProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
}

export class ReviewListItem extends Component<ReviewListItemProps> {
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
