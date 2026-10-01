import { createContext } from "react";
import type { User } from "../interface/user";

export interface AuthContextType {
  loggedUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);