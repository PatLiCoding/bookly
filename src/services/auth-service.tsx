import { supabase } from "../lib/supabase";

/** Payload properties required for registering a new user account. */
export interface SignUpData {
  /** User's given first name. */
  firstname: string;
  /** User's family surname. */
  lastname: string;
  /** Primary user email address. */
  email: string;
  /** Account password. */
  password: string;
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "E-Mail oder Passwort falsch",
  email_not_confirmed: "Bitte bestätige zuerst deine E-Mail-Adresse",
  user_already_exists: "E-Mail wird bereits verwendet",
  email_exists: "E-Mail wird bereits verwendet",
  weak_password: "Das Passwort ist zu schwach (mindestens 6 Zeichen)",
  user_banned: "Dein Konto wurde gesperrt. Bitte wende dich an den Support.",
};

/**
 * Translates a Supabase authentication error code into a localized user-facing German error message.
 *
 * @param error - The Supabase auth error object.
 * @returns Human-readable German error string.
 */
function authMessage(error: { code?: string }): string {
  return (
    MESSAGES[error.code ?? ""] ??
    "Etwas ist schiefgelaufen. Bitte versuche es erneut."
  );
}

/**
 * Authenticates an existing user using email credentials and password.
 *
 * @param email - User's email address.
 * @param password - Account password.
 * @throws `Error` with a localized message if authentication fails.
 */
export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(authMessage(error));
}

/**
 * Registers a new user account, triggering profile creation via database hooks.
 *
 * @param data - User registration payload containing credentials and name parameters.
 * @throws `Error` with a localized message if registration fails.
 */
export async function signUp(data: SignUpData): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { firstname: data.firstname, lastname: data.lastname } },
  });
  if (error) throw new Error(authMessage(error));
}

/**
 * Signs out the currently active user session from Supabase auth.
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Translates database errors related to blocked account deletions. */
function deleteMessage(message: string): string {
  return message.includes("open_orders")
    ? "Du hast noch offene Bestellungen. Das Konto kann gelöscht werden, sobald sie zugestellt oder storniert sind."
    : message;
}

/**
 * Deletes the authenticated user's own account via RPC database function,
 * then terminates local session storage.
 *
 * @throws `Error` if the database deletion request fails.
 */
export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.rpc("delete_own_account");
  if (error) throw new Error(deleteMessage(error.message));
  await supabase.auth.signOut({ scope: "local" });
}

/**
 * Deletes the user account via RPC and signs out locally upon success.
 * Throws a localized error if deletion is blocked (e.g., due to active orders).
 */
export async function deleteOwnAccountAndSignOut(): Promise<void> {
  const { error } = await supabase.rpc("delete_own_account");
  if (error) {
    const message = error.message.includes("open_orders")
      ? "Du hast noch offene oder versendete Bestellungen. Das Konto kann erst gelöscht werden, wenn alle Bestellungen zugestellt oder storniert sind."
      : error.message;
    throw new Error(message, { cause: error });
  }
  await supabase.auth.signOut({ scope: "local" });
}