/** Generic map object storing dynamic form field string values. */
export type Values = Record<string, string>;

/** Event callback signature for generic form input state changes. */
export type ChangeHandler = (key: string, value: string) => void;

/** Meta descriptor for an individual dynamic form input field. */
export interface Field {
  /** Target object key identifier. */
  key: string;
  /** Visible input label text. */
  label: string;
}

/** Configuration structure defining standard address form sections. */
export interface AddressConfig {
  /** Section heading title string. */
  title: string;
  /** List of form field configurations. */
  fields: Field[];
}
