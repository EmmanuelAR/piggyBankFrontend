import { useState, useEffect } from "react";
import { User, AuthError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface UserProfile {
  id: string;
  wallet_address: string;
  email: string;
  private_pk: string;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", error);
      }

      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    const response = await fetch("/api/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ network: "sepolia" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: null,
        error: new Error(`Wallet API error: ${errorText}`) as AuthError,
      };
    }

    const walletData = await response.json();
    const { address, private_key, public_key } = walletData;

    // 2. Crea el usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // 3. Crea el perfil de usuario con los datos del wallet
      const { error: profileError } = await supabase.from("users").insert({
        address,
        private_key,
        uid: data.user?.id,
        public_pk: public_key,
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
      }
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user && !error) {
      await fetchUserProfile(data.user.id);
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUserProfile(null);
    return { error };
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user)
      return { data: null, error: new Error("No user logged in") as AuthError };

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (!error && data) {
      setUserProfile(data);
    }

    return { data: data || null, error };
  };

  return {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  };
}
