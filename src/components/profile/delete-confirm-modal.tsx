import { Component } from "react";
import "../../styles/modal.css";

interface DeleteConfirmModalProps {
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DEFAULT_TITLE = "Account wirklich löschen?";
const DEFAULT_MESSAGE =
  "Laufende oder bereits versendete Bestellungen können nach dem Löschen nicht mehr eingesehen werden. Diese Aktion kann nicht rückgängig gemacht werden.";

export class DeleteConfirmModal extends Component<DeleteConfirmModalProps> {
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
