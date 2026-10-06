import { useContext } from "react";
import { AuthContext } from "./auth-context";

/**
 * Custom React hook consuming the global `AuthContext`.
 *
 * @returns The active `AuthContextType` value object.
 * @throws {Error} If called outside of an `<AuthProvider>` ancestor component.
 */
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
