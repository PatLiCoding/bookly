/** Single input field of an address form. */
export interface AddressField {
  key: string;
  label: string;
  /** Virtual keyboard hint for mobile devices. */
  inputMode?: "text" | "numeric";
  /** Maximum number of characters allowed. */
  maxLength?: number;
  /** Strips every non-digit character from the input. */
  onlyNumbers?: boolean;
}

/** Shared zip code field: digits only, max. 5 characters. */
const ZIP_FIELD: AddressField = {
  key: "zip",
  label: "PLZ",
  inputMode: "numeric",
  maxLength: 5,
  onlyNumbers: true,
};

/** Field rows of the billing address; fields in one row are shown side by side. */
export const BILLING_ROWS: AddressField[][] = [
  [
    { key: "firstname", label: "Vorname" },
    { key: "lastname", label: "Nachname" },
  ],
  [{ key: "street", label: "Straße & Hausnummer" }],
  [ZIP_FIELD, { key: "city", label: "Ort" }],
  [{ key: "country", label: "Land" }],
];

/** Field rows of the shipping address; fields in one row are shown side by side. */
export const SHIPPING_ROWS: AddressField[][] = [
  [
    { key: "Firstname", label: "Vorname" },
    { key: "Lastname", label: "Nachname" },
  ],
  [{ key: "street", label: "Straße & Hausnummer" }],
  [ZIP_FIELD, { key: "city", label: "Ort" }],
  [{ key: "country", label: "Land" }],
];
