import { Component } from "react";
import type { Review } from "../../interface/review";
import { renderStars } from "../../utils/render-stars";

/** Props for the ReviewComment component. */
interface ReviewCommentProps {
  /** Review data containing author name, star rating, creation date, and text body. */
  review: Review;
}

/**
 * Class component displaying an individual user review comment card.
 */
export class ReviewComment extends Component<ReviewCommentProps> {
  render() {
    const { review } = this.props;
    return (
      <div className="comment-card">
        <div className="comment-header">
          <span className="user-name">{review.userName}</span>
          <div className="stars">
            {renderStars(review.rating)}
            <p className="comment-date">{review.date}</p>
          </div>
        </div>
        <div className="comment-text">
          <p>{review.text}</p>
        </div>
      </div>
    );
  }
}