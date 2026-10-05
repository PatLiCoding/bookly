import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { User } from "../interface/user";
import { AuthContext } from "./auth-context";
import type { AuthContextType } from "./auth-context";
import * as auth from "../services/auth-service";
import { loadUser, saveProfile } from "../services/profile-service";

/** Follows the Supabase session (also restores it after a reload). */
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

/** Loads the user of the session; without a session there is no user. */
function fetchUser(userId: string | null, email: string): Promise<User | null> {
  return userId ? loadUser(userId, email) : Promise.resolve(null);
}

/** Loads profile and addresses as soon as the session is known. */
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

/** Saves changes to Supabase, then reloads the user so new ids are in sync. */
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

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={useAuthValue()}>{children}</AuthContext.Provider>
  );
}