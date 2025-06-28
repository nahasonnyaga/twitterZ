"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utilities/supabase";

export default function SetupProfilePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.error("No active session. Redirecting to login.");
        router.push("/login");
      } else {
        // Optional: could check if profile already exists here and skip setup
        setSessionChecked(true);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async () => {
    if (!username.trim()) return;
    setLoading(true);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("Session expired. Redirecting to login.");
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("profiles").insert({
      id: session.user.id,
      username: username.trim(),
    });

    if (error) {
      console.error("Error creating profile:", error);
      alert("Error creating profile. Please try a different username or check your connection.");
    } else {
      router.push("/feed");
    }
    setLoading(false);
  };

  if (!sessionChecked) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="text-black text-center text-lg">Checking session...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-black text-center">Choose a Username</h1>
        <input
          type="text"
          className="w-full p-3 rounded border border-gray-300 mb-4 text-black"
          placeholder="e.g. johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Setting up..." : "Continue"}
        </button>
      </div>
    </main>
  );
}
