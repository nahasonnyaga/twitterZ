import { createClient } from "@supabase/supabase-js";

// Define clear constants ONCE from your environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Optional: fail fast if env vars are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(`
❌ Missing Supabase environment variables!
Check your .env.local file and ensure:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
  `);
}

// Then just use the constants below
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
