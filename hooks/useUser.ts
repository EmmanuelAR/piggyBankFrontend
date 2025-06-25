// hooks/useUser.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { userUidAtom } from "../contexts/userUidAtom";
import { useAtom } from "jotai";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const [uid] = useAtom(userUidAtom);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Trae los datos de la tabla users
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("uid", user.id)
          .single();
        setUser(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
}
