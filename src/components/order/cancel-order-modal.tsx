import { Component } from "react";

interface CancelOrderModalProps {
  orderId: string | number;
  onConfirm: () => void;
  onCancel: () => void;
}

export class CancelOrderModal extends Component<CancelOrderModalProps> {
  render() {
    const { orderId, onConfirm, onCancel } = this.props;

    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>Bestellung stornieren</h3>
          <p>
            Bist du dir sicher, dass du die Bestellung <strong>#{orderId}</strong> stornieren möchtest?
          </p>
          <div className="modal-actions">
            <button className="modal-btn-cancel" onClick={onCancel}>
              Abbrechen
            </button>
            <button className="modal-btn-confirm" onClick={onConfirm}>
              Bestellung stornieren
            </button>
          </div>
        </div>
      </div>
    );
  }
}