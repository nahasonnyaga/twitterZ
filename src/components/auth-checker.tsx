"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utilities/supabase";

export default function AuthChecker() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      console.log("🔎 Session data:", session);
      if (error) {
        console.error("❌ Error checking session:", error);
        return;
      }

      if (!session) {
        console.warn("⚠️ No active session, redirecting to login...");
        router.push("/login");
      } else {
        console.log("✅ Active session found:", session);
        router.push("/feed");
      }
    };

    checkSession();
  }, [router]);

  return null;
}

