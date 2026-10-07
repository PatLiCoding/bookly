import type { LegalDocument, LegalType } from "../interface/legal";
import { ADDRESS_BLOCK, LEGAL_CONFIG as c } from "./legal-config";

/** Imprint (Impressum) according to § 5 DDG. */
const imprint: LegalDocument = {
  title: "Impressum",
  sections: [
    { title: "Angaben gemäß § 5 DDG", paragraphs: [ADDRESS_BLOCK] },
    { title: "Kontakt", paragraphs: [`E-Mail: ${c.email}`] },
    {
      title: "Hinweis zum Projekt",
      paragraphs: [
        "Bookly ist ein Demo- und Portfolio-Projekt und befindet sich noch im Aufbau. Es handelt sich nicht um einen echten Online-Shop: Es werden keine Waren verkauft, verschickt oder bezahlt. Alle Bücher, Beschreibungen, Bewertungen und Kommentare sind fiktive Beispieldaten. Texte und Titelbilder wurden mithilfe von KI erstellt.",
      ],
    },
    {
      title: "Haftung für Links",
      paragraphs: [
        "Diese Website enthält gegebenenfalls Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Für diese fremden Inhalte kann ich keine Gewähr übernehmen. Verantwortlich ist stets der jeweilige Anbieter der verlinkten Seiten.",
      ],
    },
  ],
};

/** Privacy policy (Datenschutzerklärung) according to the GDPR. */
const privacy: LegalDocument = {
  title: "Datenschutzerklärung",
  updated: c.updated,
  sections: [
    {
      title: "1. Verantwortliche Person",
      paragraphs: [`${ADDRESS_BLOCK}\nE-Mail: ${c.email}`],
    },
    {
      title: "2. Worum es hier geht",
      paragraphs: [
        "Bookly ist ein Demo- und Portfolio-Projekt. Es werden keine echten Bestellungen abgewickelt und keine Zahlungen verarbeitet. Bitte gib keine echten persönlichen Daten ein, sondern nutze für Tests erfundene Angaben (zum Beispiel eine Wegwerf-E-Mail-Adresse und ein Passwort, das du nirgends sonst verwendest).",
      ],
    },
    {
      title: "3. Hosting und Server-Logfiles",
      paragraphs: [
        `Diese Website wird bei ${c.hoster} gehostet. Beim Aufruf der Seite verarbeitet der Server technisch notwendige Daten, etwa IP-Adresse, Datum und Uhrzeit, aufgerufene Seite und Browsertyp (Logfiles). Das ist nötig, um die Seite auszuliefern und sicher zu betreiben (Art. 6 Abs. 1 lit. f DSGVO). Die Logfiles werden nach ${c.logRetention} gelöscht.`,
      ],
    },
    {
      title: "4. Benutzerkonto",
      paragraphs: ["Wenn du dich registrierst, speichere ich:"],
      list: [
        "E-Mail-Adresse und Passwort (das Passwort wird nur verschlüsselt gespeichert und ist für mich nicht lesbar)",
        "Vor- und Nachname sowie optional deine Adresse (Straße, PLZ, Ort, Land) im Profil",
        "Lieferadressen, die du hinterlegst",
      ],
    },
    {
      title: "Zweck und Rechtsgrundlage des Kontos",
      paragraphs: [
        "Zweck ist die Bereitstellung des Kontos und der Shop-Funktionen. Rechtsgrundlage ist die Durchführung der Nutzung, die du mit der Registrierung wünschst (Art. 6 Abs. 1 lit. b DSGVO).",
      ],
    },
    {
      title: "5. Bestellungen",
      paragraphs: [
        "Wenn du eine Demo-Bestellung aufgibst, werden die bestellten Bücher, der Gesamtpreis, das Bestelldatum und der Status (in Bearbeitung, versendet, zugestellt) zusammen mit deinem Konto gespeichert, damit du deine Bestellungen einsehen kannst (Art. 6 Abs. 1 lit. b DSGVO). Es findet keine Zahlungsabwicklung statt.",
      ],
    },
    {
      title: "6. Bewertungen und Kommentare",
      paragraphs: [
        "Wenn du ein Buch bewertest oder kommentierst, werden Sternebewertung, Kommentar, Zeitpunkt und dein Name öffentlich sichtbar gespeichert, damit andere Besucher die Bewertung lesen können (Art. 6 Abs. 1 lit. b DSGVO). Du kannst deine Bewertungen jederzeit in deinem Profil bearbeiten oder löschen. Wenn du deinen Namen nicht öffentlich zeigen möchtest, verwende einen Fantasienamen.",
      ],
    },
    {
      title: "7. Datenbank und Anmeldung (Supabase)",
      paragraphs: [
        `Konto, Bestellungen und Bewertungen werden über den Dienst Supabase gespeichert und verwaltet. Anbieter ist Supabase, Inc. (USA). Die Datenbank liegt in der Region ${c.supabaseRegion}. Mit Supabase besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO). Soweit Daten in die USA übermittelt werden können, geschieht das auf Grundlage von Standardvertragsklauseln beziehungsweise des EU-US Data Privacy Framework.`,
      ],
    },
    {
      title: "8. Lokale Speicherung im Browser",
      paragraphs: [
        "Die Website speichert Informationen im lokalen Speicher deines Browsers (localStorage), die für den Betrieb notwendig sind:",
      ],
      list: [
        "Warenkorb: damit deine Artikel nach dem Neuladen erhalten bleiben",
        "Anmeldestatus: damit du eingeloggt bleibst",
      ],
    },
    {
      title: "Rechtsgrundlage der lokalen Speicherung",
      paragraphs: [
        "Diese Daten sind technisch erforderlich, um die von dir gewünschte Funktion bereitzustellen (§ 25 Abs. 2 Nr. 2 TDDDG). Eine Einwilligung ist dafür nicht nötig. Du kannst sie jederzeit über die Einstellungen deines Browsers löschen. Es werden keine Cookies für Werbung, Tracking oder Reichweitenmessung eingesetzt.",
      ],
    },
    {
      title: "9. Keine Weitergabe, kein Tracking",
      paragraphs: [
        "Ich setze keine Analyse- oder Tracking-Tools ein und gebe deine Daten nicht an Dritte weiter, außer an die oben genannten Dienstleister, die für den Betrieb nötig sind. Schriftarten werden lokal vom eigenen Server geladen, es wird keine Verbindung zu Google Fonts aufgebaut.",
      ],
    },
    {
      title: "10. Speicherdauer und Löschung",
      paragraphs: [
        "Deine Daten bleiben gespeichert, solange dein Konto besteht. Du kannst dein Konto jederzeit in deinem Profil selbst löschen. Dabei werden Profil, Adressen, Bestellungen und Bewertungen mit gelöscht. Server-Logfiles werden wie in Abschnitt 3 beschrieben gelöscht.",
      ],
    },
    {
      title: "11. Deine Rechte",
      paragraphs: [
        "Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Schreib dazu einfach an die E-Mail-Adresse oben.",
        `Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist ${c.authority}.`,
      ],
    },
    {
      title: "12. Änderungen",
      paragraphs: [
        "Ich passe diese Erklärung an, wenn sich das Projekt oder die Rechtslage ändert. Es gilt die jeweils hier veröffentlichte Fassung.",
      ],
    },
  ],
};

/** Lookup of all legal documents by type. */
export const legalDocuments: Record<LegalType, LegalDocument> = {
  imprint,
  privacy,
};
