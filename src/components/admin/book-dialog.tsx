import { type MouseEvent } from "react";
import { CATEGORIES } from "../../constants/categories";
import useBookForm from "../../hooks/use-book-form";
import useModalDialog from "../../hooks/use-modal-dialog";
import type { AdminBook, BookListItem } from "../../services/admin-service";
import type { BookFormValues, ChangeField, TextField } from "../../utils/book-form";
import CoverField from "./cover-field";
import AdminSelect from "./admin-select";

interface FieldConfig {
  key: TextField;
  label: string;
  type?: string;
  required?: boolean;
  min?: string;
  step?: string;
  /** Renders a dropdown select control instead of a text input. */
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

/**
 * Renders a custom select dropdown control for categories. 
 * Retains any active value that is not present in the default category list.
 */
function SelectControl({ field, value, onChange }: ControlProps) {
  const base = field.options ?? [];
  const options = value && !base.includes(value) ? [value, ...base] : base;
  
  return (
    <AdminSelect
      value={value || options[0]}
      options={options}
      onChange={(val) => onChange(val)}
    />
  );
}

/**
 * Renders a standard text, number, or date input control.
 */
function InputControl({ field, value, onChange }: ControlProps) {
  const { type, required, min, step } = field;
  return (
    <input
      type={type} required={required} min={min} step={step}
      value={value} onChange={(e) => onChange(e.target.value)}
    />
  );
}

interface FieldsProps {
  values: BookFormValues;
  change: ChangeField;
  setHidden: (hidden: boolean) => void;
}

/**
 * Renders all form controls including generated input fields, cover uploader, description textarea, and visibility toggle.
 */
function BookFields({ values, change, setHidden }: FieldsProps) {
  const renderField = (field: FieldConfig) => {
    const Control = field.options ? SelectControl : InputControl;
    return (
      <label key={field.key} className="admin-field">
        {field.label}
        <Control field={field} value={values[field.key]} onChange={(v) => change(field.key, v)} />
      </label>
    );
  };

  const titleField = FIELDS.find((f) => f.key === "title")!;
  const authorField = FIELDS.find((f) => f.key === "author")!;
  const categoryField = FIELDS.find((f) => f.key === "category")!;
  const priceField = FIELDS.find((f) => f.key === "price")!;
  const releaseDateField = FIELDS.find((f) => f.key === "release_date")!;

  return (
    <>
      {renderField(titleField)}
      {renderField(authorField)}

      <div className="admin-form-grid">
        {renderField(categoryField)}
        {renderField(priceField)}
      </div>

      {renderField(releaseDateField)}

      <CoverField value={values.cover} onChange={(v) => change("cover", v)} />

      <label className="admin-field">
        Beschreibung
        <textarea
          rows={4}
          value={values.description}
          onChange={(e) => change("description", e.target.value)}
        />
      </label>

      <label className="admin-check">
        <input type="checkbox" checked={!values.hidden} onChange={(e) => setHidden(!e.target.checked)} />
        Im Shop sichtbar
      </label>
    </>
  );
}

/**
 * Renders form action buttons for canceling or submitting form changes.
 */
function DialogActions({ saving, onCancel }: { saving: boolean; onCancel: () => void }) {
  return (
    <div className="admin-dialog-actions">
      <button type="button" className="admin-cancel-btn" onClick={onCancel}>
        Abbrechen
      </button>
      <button type="submit" className="admin-save-btn" disabled={saving}>
        {saving ? "Speichert …" : "Speichern"}
      </button>
    </div>
  );
}

/**
 * Closes the dialog when clicking directly on the backdrop container.
 */
function closeOnBackdrop(e: MouseEvent<HTMLDialogElement>) {
  if (e.target === e.currentTarget) e.currentTarget.close();
}

interface Props {
  /** Target book object to edit, or null to create a new book entry. */
  book: AdminBook | null;
  onClose: () => void;
  onSaved: (saved: BookListItem) => void;
}

/**
 * Modal dialog for creating a new book or editing an existing one.
 */
export default function BookDialog({ book, onClose, onSaved }: Props) {
  const ref = useModalDialog();
  const form = useBookForm(book, onSaved);

  return (
    <dialog ref={ref} className="admin-dialog" onClose={onClose} onClick={closeOnBackdrop}>
      <form className="admin-dialog-form" onSubmit={form.submit}>
        <h2>{book ? "Buch bearbeiten" : "Neues Buch anlegen"}</h2>
        <BookFields values={form.values} change={form.change} setHidden={form.setHidden} />
        {form.error && <p className="admin-message error">{form.error}</p>}
        <DialogActions saving={form.saving} onCancel={onClose} />
      </form>
    </dialog>
  );
}