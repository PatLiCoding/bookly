import type { ChangeEvent } from "react";
import type { Field, Values } from "../../interface/checkout";

/** Props for the CheckoutField component. */
interface CheckoutFieldProps {
  /** Metadata configuration for the field (e.g., label, key). */
  field: Field;
  /** Key-value store containing current form values. */
  values: Values;
  /** Callback fired when the input value changes. */
  onChange: (key: string, value: string) => void;
}

/**
 * Renders a single labeled text input field dynamically bound to checkout values.
 */
export function CheckoutField({ field, values, onChange }: CheckoutFieldProps) {
  return (
    <label className="checkout-field">
      <span>{field.label}</span>
      <input
        type="text"
        value={values[field.key] ?? ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.value)}
      />
    </label>
  );
}