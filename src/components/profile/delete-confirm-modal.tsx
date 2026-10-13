import { Component } from "react";
import "../../styles/modal.css";

/** Props for the DeleteConfirmModal class component. */
interface DeleteConfirmModalProps {
  /** Optional header title for the modal dialog. */
  title?: string;
  /** Optional descriptive explanation text. */
  message?: string;
  /** Custom text label for the primary confirmation button. */
  confirmLabel?: string;
  /** Optional error message to display inside the modal. */
  error?: string | null;
  /** Callback fired when the user confirms the deletion action. */
  onConfirm: () => void;
  /** Callback fired when the user cancels or closes the modal backdrop. */
  onCancel: () => void;
}

const DEFAULT_TITLE = "Account wirklich löschen?";
const DEFAULT_MESSAGE =
  "Das Konto kann erst gelöscht werden, wenn alle Bestellungen zugestellt oder storniert sind. Diese Aktion kann nicht rückgängig gemacht werden.";

/**
 * Class component rendering a modal confirmation dialog for destructive deletion actions.
 */
export class DeleteConfirmModal extends Component<DeleteConfirmModalProps> {
  /** Renders the cancel and confirm action buttons. */
  private renderActions() {
    const { onConfirm, onCancel, confirmLabel = "Endgültig löschen" } = this.props;
    return (
      <div className="modal-actions">
        <button className="modal-btn-cancel" onClick={onCancel}>
          Abbrechen
        </button>
        <button className="modal-btn-confirm" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    );
  }

  render() {
    const { title = DEFAULT_TITLE, message = DEFAULT_MESSAGE, error } = this.props;
    return (
      <div className="modal-overlay" onClick={this.props.onCancel}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h3>{title}</h3>
          <p>{message}</p>
          {error && (
            <div style={{ color: "#d9534f", background: "#fdf2f2", padding: "10px", borderRadius: "4px", margin: "10px 0", fontSize: "14px" }}>
              {error}
            </div>
          )}
          {this.renderActions()}
        </div>
      </div>
    );
  }
}
