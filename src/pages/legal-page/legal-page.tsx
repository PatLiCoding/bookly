import { useEffect } from "react";
import "./legal-page.css";
import { legalDocuments } from "../../data/legal-content";
import type { LegalSection, LegalType } from "../../interface/legal";

interface LegalPageProps {
  /** Which document to show: "imprint" (Impressum) or "privacy" (Datenschutz). */
  type: LegalType;
}

/**
 * Renders one section of a legal document: heading, paragraphs and optional list.
 */
function Section({ section }: { section: LegalSection }) {
  return (
    <section className="legal-section">
      <h2>{section.title}</h2>
      {section.paragraphs?.map((text) => (
        <p key={text}>{text}</p>
      ))}
      {section.list && (
        <ul>
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Page for the imprint and the privacy policy. Routes use the same component
 * and only differ in the `type` prop. Scrolls to the top when opened,
 * because it is reached via footer links.
 */
export default function LegalPage({ type }: LegalPageProps) {
  const legalDoc = legalDocuments[type];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <main className="legal-page" lang="de">
      <h1>{legalDoc.title}</h1>
      {legalDoc.updated && <p className="legal-updated">{legalDoc.updated}</p>}
      {legalDoc.sections.map((section) => (
        <Section key={section.title} section={section} />
      ))}
    </main>
  );
}