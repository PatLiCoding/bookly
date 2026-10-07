/** Which legal document the page should show. */
export type LegalType = "imprint" | "privacy";

/** One block of a legal text: a heading plus paragraphs and/or a bullet list. */
export interface LegalSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
}

/** A complete legal document (imprint or privacy policy). */
export interface LegalDocument {
  title: string;
  updated?: string;
  sections: LegalSection[];
}
