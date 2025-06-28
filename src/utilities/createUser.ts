import { supabase } from "@/utils/supabase-client";

export async function createUser({ username, name }) {
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return { success: false, error: sessionError || new Error("Not authenticated") };
  }

  const { error } = await supabase.from("profiles").insert([
    { id: user.id, username, name },
  ]);

  return { success: !error, error };
}

