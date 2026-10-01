import type { ChangeEvent } from "react";
import type { Field, Values } from "../../interface/checkout";

interface CheckoutFieldProps {
  field: Field;
  values: Values;
  onChange: (key: string, value: string) => void;
}

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