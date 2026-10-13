import useModalDialog from "../../hooks/use-modal-dialog";
import type { MouseEvent, ReactNode } from "react";

/**
 * Configuration options for the AdminMessageDialog.
 */
export interface DialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  onConfirm?: () => void;
}

interface Props extends DialogConfig {
  onClose: () => void;
}

/**
 * Closes the dialog when clicking directly on the backdrop.
 */
function closeOnBackdrop(e: MouseEvent<HTMLDialogElement>) {
  if (e.target === e.currentTarget) e.currentTarget.close();
}

/**
 * Renders either action buttons (for confirmation) or a single close button (for alerts).
 */
function renderActions(
  onConfirm: (() => void) | undefined,
  onClose: () => void,
  confirmLabel: string,
  isDestructive: boolean
): ReactNode {
  if (!onConfirm) {
    return <button type="button" className="admin-save-btn" onClick={onClose}>OK</button>;
  }
  return (
    <>
      <button type="button" className="admin-cancel-btn" onClick={onClose}>Abbrechen</button>
      <button
        type="button"
        className={isDestructive ? "admin-delete-btn" : "admin-save-btn"}
        onClick={() => { onConfirm(); onClose(); }}
      >
        {confirmLabel}
      </button>
    </>
  );
}

/**
 * Universal dialog component replacing native browser alerts and confirms.
 */
export default function AdminMessageDialog({ title, message, confirmLabel = "Bestätigen", isDestructive = false, onConfirm, onClose }: Props) {
  const ref = useModalDialog();

  return (
    <dialog ref={ref} className="admin-dialog" onClose={onClose} onClick={closeOnBackdrop}>
      <div className="admin-dialog-form">
        <h2>{title}</h2>
        <p style={{ whiteSpace: "pre-line", margin: "1rem 0" }}>{message}</p>
        <div className="admin-dialog-actions">
          {renderActions(onConfirm, onClose, confirmLabel, isDestructive)}
        </div>
      </div>
    </dialog>
  );
}