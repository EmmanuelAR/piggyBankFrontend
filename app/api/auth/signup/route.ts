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
        { error: "Email, password, firstName and lastName are required" },
        { status: 400 }
      );
    }

    // Realizar el sign up con Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Sign up error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "No user data returned" },
        { status: 400 }
      );
    }

    const walletRes = await fetch(
      "https://services.cavos.xyz/api/v1/external/deploy",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.CAVOS_API_KEY || "",
        },
        body: JSON.stringify({ network: "sepolia" }),
      }
    );
    const wallet = await walletRes.json();
    console.log("wallet", wallet);

    // Crear el perfil del usuario en la tabla users
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .insert([
        {
          uid: data.user.id,
          wallet_address: wallet.address,
          private_pk: wallet.private_key,
          public_key: wallet.public_key,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      // Si hay error al crear el perfil, eliminamos el usuario creado
      await supabase.auth.admin.deleteUser(data.user.id);
      return NextResponse.json(
        { error: "Error creating user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        user: data.user,
        userProfile,
        session: data.session,
        message: "User created successfully",
      },
      { status: 201 }
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
