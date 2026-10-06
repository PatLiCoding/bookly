import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { User } from "../interface/user";
import { AuthContext } from "./auth-context";
import type { AuthContextType } from "./auth-context";
import * as auth from "../services/auth-service";
import { loadUser, saveProfile } from "../services/profile-service";

/**
 * Custom hook listening to Supabase authentication state changes and managing session state.
 */
function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return { userId: session?.user.id ?? null, email: session?.user.email ?? "", ready };
}

/**
 * Helper function fetching user profile details when a valid user ID is provided.
 *
 * @param userId - Unique user identifier from the active session.
 * @param email - Email address associated with the active session.
 */
function fetchUser(userId: string | null, email: string): Promise<User | null> {
  return userId ? loadUser(userId, email) : Promise.resolve(null);
}

/**
 * Custom hook loading user profile details whenever the active session becomes ready.
 *
 * @param userId - User identifier from session state.
 * @param email - User email address from session state.
 * @param ready - Indicates whether session restoration has completed.
 */
function useLoggedUser(userId: string | null, email: string, ready: boolean) {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!ready) return;
    let active = true;

    fetchUser(userId, email)
      .then((user) => active && setLoggedUser(user))
      .catch(console.error);
    return () => { active = false; };
  }, [ready, userId, email]);

  return { loggedUser, setLoggedUser, loading: !ready || (!!userId && !loggedUser) };
}

/**
 * Custom hook returning a memoized callback to update and synchronize user profile data with Supabase.
 *
 * @param loggedUser - Current user state object.
 * @param setLoggedUser - React state dispatcher for updating user state.
 */
function useUpdateUser(
  loggedUser: User | null,
  setLoggedUser: (user: User) => void,
) {
  return useCallback(
    async (updated: Partial<User>) => {
      if (!loggedUser) return;
      await saveProfile(loggedUser, updated);
      const fresh = await loadUser(loggedUser.id, loggedUser.email);
      setLoggedUser({ ...fresh, order: updated.order ?? loggedUser.order });
    },
    [loggedUser, setLoggedUser],
  );
}

/**
 * Assembles and memoizes the complete `AuthContextType` value bundle.
 */
function useAuthValue(): AuthContextType {
  const { userId, email, ready } = useSession();
  const { loggedUser, setLoggedUser, loading } = useLoggedUser(userId, email, ready);
  const updateUser = useUpdateUser(loggedUser, setLoggedUser);

  return useMemo(
    () => ({
      loggedUser,
      loading,
      updateUser,
      signIn: auth.signIn,
      signUp: auth.signUp,
      logout: auth.signOut,
      deleteAccount: auth.deleteAccount,
    }),
    [loggedUser, loading, updateUser],
  );
}

/**
 * Context Provider wrapping the component tree to supply global authentication state and methods.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={useAuthValue()}>{children}</AuthContext.Provider>
  );
}