import { useState, useEffect } from "react";
import { User, AuthError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      console.log("Auth state changed:", _event, session?.user?.id);
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
        .from("users")
        .select("*")
        .eq("uid", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", error);
      }

      console.log("dataaaaa", data);

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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer cavos-c78c75073a9fd1cbaf99d696`,
      },
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

    const { address, private_key, public_key } = walletData?.data;

    // 2. Crea el usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // 3. Crea el perfil de usuario con los datos del wallet
      const { error: profileError } = await supabase.from("users").insert({
        wallet_address: address,
        private_pk: private_key,
        uid: data.user?.id,
        public_key: public_key,
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
      }

      // Redirigir a new-savings después del registro exitoso
      router.push("/new-savings");
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: new Error(result.error || "Sign in failed") as AuthError,
        };
      }

      // Actualizar el estado local con los datos del usuario
      setUser(result.user);
      setUserProfile(result.userProfile);

      console.log("signIn data", result);

      // Redirigir a new-savings después del login exitoso
      router.push("/new-savings");

      return { data: result, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      return {
        data: null,
        error: new Error(error.message || "Sign in failed") as AuthError,
      };
    }
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
      .from("users")
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
