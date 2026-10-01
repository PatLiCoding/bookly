import { Component } from "react";
import type { Review } from "../../interface/review";
import { ReviewListItem } from "./review-list-item";
import { DeleteConfirmModal } from "../profile/delete-confirm-modal";
import { ReviewFormModal } from "./review-form-modal";
import { deleteReview, updateReview } from "../../services/review-service";
import type { ReviewInput } from "../../services/review-service";

interface UserReviewsProps {
  reviews: Review[];
  userId: number;
  onChanged: () => void;
}

interface UserReviewsState {
  editing: Review | null;
  deleting: Review | null;
}

export class UserReviews extends Component<
  UserReviewsProps,
  UserReviewsState
> {
  state: UserReviewsState = { editing: null, deleting: null };

  private handleEditSubmit = async (input: ReviewInput) => {
    const { editing } = this.state;
    if (!editing) return;
    await updateReview(editing.id, this.props.userId, input);
    this.setState({ editing: null });
    this.props.onChanged();
  };

  private handleDeleteConfirm = async () => {
    const { deleting } = this.state;
    if (!deleting) return;
    await deleteReview(deleting.id, this.props.userId);
    this.setState({ deleting: null });
    this.props.onChanged();
  };

  private renderItem = (review: Review) => (
    <ReviewListItem
      key={review.id}
      review={review}
      onEdit={() => this.setState({ editing: review })}
      onDelete={() => this.setState({ deleting: review })}
    />
  );

  private renderEditModal(review: Review) {
    return (
      <ReviewFormModal
        title={`Bewertung bearbeiten: ${review.bookTitle}`}
        initial={{ rating: review.rating, text: review.text }}
        onSubmit={this.handleEditSubmit}
        onCancel={() => this.setState({ editing: null })}
      />
    );
  }

  private renderDeleteModal() {
    return (
      <DeleteConfirmModal
        title="Bewertung wirklich löschen?"
        message="Deine Bewertung wird entfernt. Du kannst das Buch danach erneut bewerten."
        confirmLabel="Löschen"
        onConfirm={this.handleDeleteConfirm}
        onCancel={() => this.setState({ deleting: null })}
      />
    );
  }

  render() {
    const { editing, deleting } = this.state;
    return (
      <>
        {this.props.reviews.map(this.renderItem)}
        {editing && this.renderEditModal(editing)}
        {deleting && this.renderDeleteModal()}
      </>
    );
  }
}