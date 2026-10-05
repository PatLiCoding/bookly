import { supabase } from "../lib/supabase";

export interface SignUpData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "E-Mail oder Passwort falsch",
  email_not_confirmed: "Bitte bestätige zuerst deine E-Mail-Adresse",
  user_already_exists: "E-Mail wird bereits verwendet",
  email_exists: "E-Mail wird bereits verwendet",
  weak_password: "Das Passwort ist zu schwach (mindestens 6 Zeichen)",
};

/** Translates a Supabase auth error into a short German message. */
function authMessage(error: { code?: string }): string {
  return (
    MESSAGES[error.code ?? ""] ??
    "Etwas ist schiefgelaufen. Bitte versuche es erneut."
  );
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(authMessage(error));
}

/** Registers a user; the database trigger creates the profile from the metadata. */
export async function signUp(data: SignUpData): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { firstname: data.firstname, lastname: data.lastname } },
  });
  if (error) throw new Error(authMessage(error));
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Deletes the own account (database function), then clears the local session. */
export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.rpc("delete_own_account");
  if (error) throw new Error(error.message);
  await supabase.auth.signOut({ scope: "local" });
}
