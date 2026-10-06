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
  /** Callback fired when the user confirms the deletion action. */
  onConfirm: () => void;
  /** Callback fired when the user cancels or closes the modal backdrop. */
  onCancel: () => void;
}

const DEFAULT_TITLE = "Account wirklich löschen?";
const DEFAULT_MESSAGE =
  "Laufende oder bereits versendete Bestellungen können nach dem Löschen nicht mehr eingesehen werden. Diese Aktion kann nicht rückgängig gemacht werden.";

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
    const { title = DEFAULT_TITLE, message = DEFAULT_MESSAGE } = this.props;
    return (
      <div className="modal-overlay" onClick={this.props.onCancel}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h3>{title}</h3>
          <p>{message}</p>
          {this.renderActions()}
        </div>
      </div>
    );
  }
}
