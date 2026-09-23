import { Component } from "react";

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export class DeleteConfirmModal extends Component<DeleteConfirmModalProps> {
  render() {
    const { onConfirm, onCancel } = this.props;
    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h3>Account wirklich löschen?</h3>
          <p>
            Laufende oder bereits versendete Bestellungen können nach dem
            Löschen nicht mehr eingesehen werden. Diese Aktion kann nicht
            rückgängig gemacht werden.
          </p>
          <div className="modal-actions">
            <button className="modal-btn-cancel" onClick={onCancel}>
              Abbrechen
            </button>
            <button className="modal-btn-confirm" onClick={onConfirm}>
              Endgültig löschen
            </button>
          </div>
        </div>
      </div>
    );
  }
}
