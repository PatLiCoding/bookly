import { Component } from "react";
import type { Book } from "../../interface/book";
import type { Review, User } from "../../interface/user";
import { ReviewComment } from "./review-comment";
import { ReviewFormModal } from "./review-form-modal";
import { addReview, findUserReview } from "../../services/review-service";
import type { ReviewInput } from "../../services/review-service";
import "./review.css";

interface ReviewSectionProps {
  book: Book;
  user: User | null;
  reviews: Review[];
  onChanged: () => void;
}

interface ReviewSectionState {
  showModal: boolean;
}

/** Kommentarbereich der Buchdetailseite inkl. „Buch kommentieren“-Dialog. */
export class ReviewSection extends Component<
  ReviewSectionProps,
  ReviewSectionState
> {
  state: ReviewSectionState = { showModal: false };

  private handleSubmit = async (input: ReviewInput) => {
    const { book, user, onChanged } = this.props;
    if (!user) return;
    try {
      await addReview(book, user, input);
    } catch {
      // Bereits bewertet: die neu geladene Liste zeigt das an.
    }
    this.setState({ showModal: false });
    onChanged();
  };

  private renderAction() {
    const { user, reviews } = this.props;
    if (!user) return <p className="review-hint">Bitte anmelden, um dieses Buch zu bewerten.</p>;
    if (findUserReview(reviews, user.id))
      return <p className="review-hint">Du hast dieses Buch bereits bewertet – bearbeiten kannst du es in deinem Profil.</p>;
    return (
      <button
        className="review-add-btn"
        onClick={() => this.setState({ showModal: true })}
      >
        Buch kommentieren
      </button>
    );
  }

  private renderList() {
    const { reviews } = this.props;
    if (reviews.length === 0) return <p>Noch keine Kommentare vorhanden.</p>;
    return reviews.map((r) => <ReviewComment key={r.id} review={r} />);
  }

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