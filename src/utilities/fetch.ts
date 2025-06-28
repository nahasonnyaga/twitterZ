import { supabase } from "./supabase";

export async function fetchUserProfile(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("fetchUserProfile error:", error);
    return null;
  }

  return { user: data };
}
