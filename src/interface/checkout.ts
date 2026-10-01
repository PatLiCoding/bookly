export type Values = Record<string, string>;
export type ChangeHandler = (key: string, value: string) => void;

export interface Field {
  key: string;
  label: string;
}

export interface AddressConfig {
  title: string;
  fields: Field[];
}
