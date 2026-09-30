import { Component } from "react";
import { StarInput } from "./star-input";
import { isValidReview } from "../../services/review-service";
import type { ReviewInput } from "../../services/review-service";
import "../../styles/modal.css";
import "./review.css";

interface ReviewFormModalProps {
  title: string;
  initial?: ReviewInput;
  onSubmit: (input: ReviewInput) => void;
  onCancel: () => void;
}

interface ReviewFormModalState {
  rating: number;
  text: string;
  error: string;
}

const ERROR_TEXT = "Bitte Sterne wählen und einen Kommentar schreiben.";

export class ReviewFormModal extends Component<
  ReviewFormModalProps,
  ReviewFormModalState
> {
  state: ReviewFormModalState = {
    rating: this.props.initial?.rating ?? 0,
    text: this.props.initial?.text ?? "",
    error: "",
  };

  private handleSubmit = () => {
    const { rating, text } = this.state;
    const input = { rating, text: text.trim() };
    if (!isValidReview(input)) {
      this.setState({ error: ERROR_TEXT });
      return;
    }
    this.props.onSubmit(input);
  };

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
