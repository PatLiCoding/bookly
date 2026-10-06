import { Component } from "react";
import { StarInput } from "./star-input";
import { isValidReview } from "../../services/review-service";
import type { ReviewInput } from "../../services/review-service";
import "../../styles/modal.css";
import "./review.css";

/** Props for the ReviewFormModal class component. */
interface ReviewFormModalProps {
  /** Modal dialog title heading. */
  title: string;
  /** Initial review values when editing an existing review. */
  initial?: ReviewInput;
  /** Callback fired with valid review data upon submission. */
  onSubmit: (input: ReviewInput) => void;
  /** Callback fired to cancel and dismiss the modal. */
  onCancel: () => void;
}

/** State schema for managing review form fields and validation errors. */
interface ReviewFormModalState {
  /** Selected star rating value. */
  rating: number;
  /** User-entered comment text string. */
  text: string;
  /** Validation error message displayed on submission failure. */
  error: string;
}

const ERROR_TEXT = "Bitte Sterne wählen und einen Kommentar schreiben.";

/**
 * Class component rendering a modal form for submitting or editing product reviews.
 */
export class ReviewFormModal extends Component<
  ReviewFormModalProps,
  ReviewFormModalState
> {
  state: ReviewFormModalState = {
    rating: this.props.initial?.rating ?? 0,
    text: this.props.initial?.text ?? "",
    error: "",
  };

  /** Validates review fields and invokes `onSubmit` if valid; otherwise updates error state. */
  private handleSubmit = () => {
    const { rating, text } = this.state;
    const input = { rating, text: text.trim() };
    if (!isValidReview(input)) {
      this.setState({ error: ERROR_TEXT });
      return;
    }
    this.props.onSubmit(input);
  };

  /** Renders the text area element for entering the review comment. */
  private renderTextarea() {
    return (
      <textarea
        className="review-textarea"
        rows={5}
        maxLength={500}
        placeholder="Dein Kommentar…"
        value={this.state.text}
        onChange={(e) => this.setState({ text: e.target.value, error: "" })}
      />
    );
  }

  /** Renders modal action buttons for cancelling or saving the review. */
  private renderActions() {
    return (
      <div className="modal-actions">
        <button className="modal-btn-cancel" onClick={this.props.onCancel}>
          Abbrechen
        </button>
        <button className="modal-btn-confirm" onClick={this.handleSubmit}>
          Speichern
        </button>
      </div>
    );
  }

  /** Renders inner modal content including header, star rating input, comment textarea, and error state. */
  private renderContent() {
    const { error, rating } = this.state;
    return (
      <>
        <h3>{this.props.title}</h3>
        <StarInput
          value={rating}
          onChange={(r) => this.setState({ rating: r, error: "" })}
        />
        {this.renderTextarea()}
        {error && <p className="review-error">{error}</p>}
        {this.renderActions()}
      </>
    );
  }

  render() {
    return (
      <div className="modal-overlay" onClick={this.props.onCancel}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}