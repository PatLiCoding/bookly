import { Component } from "react";

/** Props for the CancelOrderModal component. */
interface CancelOrderModalProps {
  /** Unique identifier of the order being cancelled. */
  orderId: string | number;
  /** Callback fired when the user confirms cancellation. */
  onConfirm: () => void;
  /** Callback fired when the user dismisses or cancels the modal. */
  onCancel: () => void;
}

/**
 * Class component rendering a modal confirmation dialog to cancel an order.
 */
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