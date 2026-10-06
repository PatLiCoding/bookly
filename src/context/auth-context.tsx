import { createContext } from "react";
import type { User } from "../interface/user";
import type { SignUpData } from "../services/auth-service";

/** Interface defining the authentication context shape and action handlers. */
export interface AuthContextType {
  /** Currently authenticated user object, or `null` if unauthenticated. */
  loggedUser: User | null;
  /** Indicates whether session loading or user fetching is in progress. */
  loading: boolean;
  /** Authenticates a user with email and password credentials. */
  signIn: (email: string, password: string) => Promise<void>;
  /** Registers a new user account. */
  signUp: (data: SignUpData) => Promise<void>;
  /** Signs out the current user session. */
  logout: () => Promise<void>;
  /** Deletes the authenticated user's account and profile data. */
  deleteAccount: () => Promise<void>;
  /** Updates the current user's profile and address properties. */
  updateUser: (updated: Partial<User>) => Promise<void>;
}

/** React Context providing authentication state and operations throughout the application tree. */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);