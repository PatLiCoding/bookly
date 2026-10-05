import { createContext } from "react";
import type { User } from "../interface/user";
import type { SignUpData } from "../services/auth-service";

export interface AuthContextType {
  loggedUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateUser: (updated: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);