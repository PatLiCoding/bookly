const env = import.meta.env;

/**
 * Returns the trimmed environment value, or a visible placeholder if it is
 * missing, so a forgotten variable is easy to spot on the page.
 */
function read(value: string | undefined, placeholder: string): string {
  return value?.trim() || placeholder;
}

/**
 * Personal details used in the imprint and the privacy policy.
 * The values come from the `.env` file (VITE_LEGAL_* variables), see `.env.example`.
 * Note: Vite bundles them into the public build - which is fine, because
 * imprint and privacy policy are public anyway.
 */
export const LEGAL_CONFIG = {
  name: read(env.VITE_LEGAL_NAME, "[VOR- UND NACHNAME]"),
  street: read(env.VITE_LEGAL_STREET, "[STRASSE UND HAUSNUMMER]"),
  zip: read(env.VITE_LEGAL_ZIP, "[PLZ]"),
  city: read(env.VITE_LEGAL_CITY, "[ORT]"),
  country: read(env.VITE_LEGAL_COUNTRY, "[LAND]"),
  email: read(env.VITE_LEGAL_EMAIL, "[E-MAIL-ADRESSE]"),
  hoster: read(env.VITE_LEGAL_HOSTER, "[HOSTING-ANBIETER]"),
  logRetention: read(env.VITE_LEGAL_LOG_RETENTION, "[FRIST DER LOGFILES]"),
  supabaseRegion: read(env.VITE_LEGAL_SUPABASE_REGION, "[SUPABASE-REGION]"),
  authority: read(env.VITE_LEGAL_AUTHORITY, "[AUFSICHTSBEHÖRDE]"),
  updated: `Stand: ${read(env.VITE_LEGAL_UPDATED, "[DATUM]")}`,
};

const { name, street, zip, city, country } = LEGAL_CONFIG;

/** Postal address as a multi-line string (line breaks are rendered by the page). */
export const ADDRESS_BLOCK = `${name}\n${street}\n${zip} ${city}\n${country}`;
