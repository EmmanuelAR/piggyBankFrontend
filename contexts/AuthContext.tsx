"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { User, AuthError, AuthResponse } from "@supabase/supabase-js";
import { useSetAtom } from "jotai";
import { userUidAtom } from "./userUidAtom";

interface UserProfile {
  id: string;
  wallet_address: string;
  email: string;
  private_pk: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: AuthResponse["data"]; error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ data: AuthResponse["data"]; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateUserProfile: (
    updates: Partial<UserProfile>
  ) => Promise<{ data: UserProfile | null; error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const setUserUid = useSetAtom(userUidAtom);

  useEffect(() => {
    if (auth.user) {
      setUserUid(auth.user.id);
    } else {
      setUserUid(null);
    }
  }, [auth.user, setUserUid]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
