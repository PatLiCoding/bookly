import { Component } from "react";
import type { Book } from "../../interface/book";
import type { Review } from "../../interface/review";
import type { User } from "../../interface/user";
import { ReviewComment } from "./review-comment";
import { ReviewFormModal } from "./review-form-modal";
import { addReview, findUserReview } from "../../services/review-service";
import type { ReviewInput } from "../../services/review-service";
import "./review.css";

/** Props for the ReviewSection component. */
interface ReviewSectionProps {
  /** Target book entity being reviewed. */
  book: Book;
  /** Currently logged-in user, or `null` if unauthenticated. */
  user: User | null;
  /** List of all existing reviews for the book. */
  reviews: Review[];
  /** Callback triggered to reload reviews after a new review is submitted. */
  onChanged: () => void;
}

/** State schema for managing modal visibility in ReviewSection. */
interface ReviewSectionState {
  /** Controls display state of the review submission modal dialog. */
  showModal: boolean;
}

/**
 * Class component rendering the overall reviews section for a book detail page,
 * including existing comments list and add-review call-to-action button/modal.
 */
export class ReviewSection extends Component<
  ReviewSectionProps,
  ReviewSectionState
> {
  state: ReviewSectionState = { showModal: false };

  /** Submits a new review and triggers a list update callback. */
  private handleSubmit = async (input: ReviewInput) => {
    const { book, user, onChanged } = this.props;
    if (!user) return;
    await addReview(book, user, input);
    this.setState({ showModal: false });
    onChanged();
  };

  /** Renders login hint, duplicate review warning, or "Add Review" action button. */
  private renderAction() {
    const { user, reviews } = this.props;
    if (!user) return <p className="review-hint">Bitte anmelden, um dieses Buch zu bewerten.</p>;
    if (findUserReview(reviews, user.id))
      return <p className="review-hint">Du hast dieses Buch bereits bewertet - bearbeiten kannst du es in deinem Profil.</p>;
    return (
      <button
        className="review-add-btn"
        onClick={() => this.setState({ showModal: true })}
      >
        Buch kommentieren
      </button>
    );
  }

  /** Renders the list of user review comment cards or an empty state message. */
  private renderList() {
    const { reviews } = this.props;
    if (reviews.length === 0) return <p>Noch keine Kommentare vorhanden.</p>;
    return reviews.map((r) => <ReviewComment key={r.id} review={r} />);
  }

  /** Renders the review modal dialog for creating a new review. */
  private renderModal() {
    return (
      <ReviewFormModal
        title={`„${this.props.book.title}“ bewerten`}
        onSubmit={this.handleSubmit}
        onCancel={() => this.setState({ showModal: false })}
      />
    );
  }

  render() {
    return (
      <div className="review-section">
        <div className="review-section-header">
          <h3>Kommentare &amp; Bewertungen</h3>
          {this.renderAction()}
        </div>
        <section className="comments-section">{this.renderList()}</section>
        {this.state.showModal && this.renderModal()}
      </div>
    );
  }
}