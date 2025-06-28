"use client";

import { useEffect } from "react";
import { supabase } from "@/utilities/supabase";

export default function DebugSession() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log("🔎 Supabase session:", data?.session, error);
    });
  }, []);

  return null;
}
