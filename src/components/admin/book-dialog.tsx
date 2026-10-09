import type { MouseEvent } from "react";
import { CATEGORIES } from "../../constants/categories";
import useBookForm from "../../hooks/use-book-form";
import useDeleteBook from "../../hooks/use-delete-book";
import useModalDialog from "../../hooks/use-modal-dialog";
import type { AdminBook, BookListItem } from "../../services/admin-service";
import type { BookFormValues, ChangeField } from "../../utils/book-form";
import CoverField from "./cover-field";

interface FieldConfig {
  key: keyof BookFormValues;
  label: string;
  type?: string;
  required?: boolean;
  min?: string;
  step?: string;
  /** Renders a dropdown instead of a text input. */
  options?: readonly string[];
}

const FIELDS: FieldConfig[] = [
  { key: "title", label: "Titel", required: true },
  { key: "author", label: "Autor", required: true },
  { key: "category", label: "Kategorie", required: true, options: CATEGORIES },
  { key: "price", label: "Preis (€)", type: "number", min: "0", step: "0.01", required: true },
  { key: "release_date", label: "Erscheinungsdatum", type: "date" },
];

interface ControlProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
}

/** Dropdown; a current value that is not in the list stays selectable. */
function SelectControl({ field, value, onChange }: ControlProps) {
  const base = field.options ?? [];
  const options = value && !base.includes(value) ? [value, ...base] : base;
  return (
    <select required={field.required} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Bitte wählen</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/** Text, number or date input. */
function InputControl({ field, value, onChange }: ControlProps) {
  const { type, required, min, step } = field;
  return (
    <input
      type={type} required={required} min={min} step={step}
      value={value} onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** All inputs of the book form: generated fields, cover upload, description. */
function BookFields({ values, change }: { values: BookFormValues; change: ChangeField }) {
  return (
    <>
      {FIELDS.map((field) => {
        const Control = field.options ? SelectControl : InputControl;
        return (
          <label key={field.key} className="admin-field">
            {field.label}
            <Control field={field} value={values[field.key]} onChange={(v) => change(field.key, v)} />
          </label>
        );
      })}
      <CoverField value={values.cover} onChange={(v) => change("cover", v)} />
      <label className="admin-field">
        Beschreibung
        <textarea
          rows={4}
          value={values.description}
          onChange={(e) => change("description", e.target.value)}
        />
      </label>
    </>
  );
}

interface ActionsProps {
  saving: boolean;
  /** True while saving or deleting: all buttons are disabled. */
  busy: boolean;
  onCancel: () => void;
  /** Only passed when an existing book is edited. */
  onDelete?: () => void;
}

/** Delete (edit mode only), cancel and save buttons. */
function DialogActions({ saving, busy, onCancel, onDelete }: ActionsProps) {
  return (
    <div className="admin-dialog-actions">
      {onDelete && (
        <button type="button" className="admin-delete-btn" disabled={busy} onClick={onDelete}>
          Löschen
        </button>
      )}
      <button type="button" className="admin-cancel-btn" disabled={busy} onClick={onCancel}>
        Abbrechen
      </button>
      <button type="submit" className="admin-save-btn" disabled={busy}>
        {saving ? "Speichert …" : "Speichern"}
      </button>
    </div>
  );
}

/** Closes the dialog when the backdrop (not the content) is clicked. */
function closeOnBackdrop(e: MouseEvent<HTMLDialogElement>) {
  if (e.target === e.currentTarget) e.currentTarget.close();
}

interface Props {
  /** Book to edit, or null to create a new one. */
  book: AdminBook | null;
  onClose: () => void;
  onSaved: (saved: BookListItem) => void;
  onDeleted: (id: number) => void;
}

/** Dialog to create a new book or to edit or delete an existing one. */
export default function BookDialog({ book, onClose, onSaved, onDeleted }: Props) {
  const ref = useModalDialog();
  const form = useBookForm(book, onSaved);
  const del = useDeleteBook(book, onDeleted);
  const error = form.error || del.error;

  return (
    <dialog ref={ref} className="admin-dialog" onClose={onClose} onClick={closeOnBackdrop}>
      <form className="admin-dialog-form" onSubmit={form.submit}>
        <h2>{book ? "Buch bearbeiten" : "Neues Buch anlegen"}</h2>
        <BookFields values={form.values} change={form.change} />
        {error && <p className="admin-message error">{error}</p>}
        <DialogActions
          saving={form.saving}
          busy={form.saving || del.deleting}
          onCancel={onClose}
          onDelete={book ? del.remove : undefined}
        />
      </form>
    </dialog>
  );
}