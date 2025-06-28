"use client";

import { supabase } from "@/utilities/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("❌ Error signing out:", error.message);
      return;
    }
    console.log("✅ Signed out");
    router.push("/login");
  };

  return (
    <button
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
