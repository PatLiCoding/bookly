/** Single input field of an address form. */
export interface AddressField {
  key: string;
  label: string;
}

/** Field rows of the billing address; fields in one row are shown side by side. */
export const BILLING_ROWS: AddressField[][] = [
  [{ key: "name", label: "Name" }],
  [{ key: "street", label: "Straße & Hausnummer" }],
  [
    { key: "zip", label: "PLZ" },
    { key: "city", label: "Ort" },
  ],
  [{ key: "country", label: "Land" }],
];

/** Field rows of the shipping address; fields in one row are shown side by side. */
export const SHIPPING_ROWS: AddressField[][] = [
  [
    { key: "Firstname", label: "Vorname" },
    { key: "Lastname", label: "Nachname" },
  ],
  [{ key: "street", label: "Straße & Hausnummer" }],
  [
    { key: "zip", label: "PLZ" },
    { key: "city", label: "Ort" },
  ],
  [{ key: "country", label: "Land" }],
];