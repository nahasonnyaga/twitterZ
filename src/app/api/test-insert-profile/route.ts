import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase-client";

export async function GET() {
  const { data, error } = await supabase.from("profiles").insert([
    {
      id: crypto.randomUUID(),    // Generate random UUID for test
      username: "testuser",
      name: "Test User",
      avatar_url: "https://via.placeholder.com/150",
    },
  ]);

  return NextResponse.json({ success: !error, data, error });
}
