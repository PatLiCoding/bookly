import { useState, type ReactNode } from "react";
import type { User } from "../interface/user";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  function login(user: User) {
    setLoggedUser(user);
  }

  function logout() {
    setLoggedUser(null);
  }

  function updateUser(updated: Partial<User>) {
    setLoggedUser((prev) => (prev ? { ...prev, ...updated } : prev));
  }

  return (
    <AuthContext.Provider value={{ loggedUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}