import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Crear cliente de Supabase para el servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Realizar el sign in con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "No user data returned" },
        { status: 400 }
      );
    }

    // Obtener el perfil del usuario
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("uid", data.user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching user profile:", profileError);
    }

    return NextResponse.json(
      {
        user: data.user,
        userProfile,
        session: data.session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
