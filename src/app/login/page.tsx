// src/app/login/page.tsx
"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/utilities/supabase";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.1 9.1 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.53 0-4.57 2.07-4.57 4.62 0 .36.04.72.12 1.06C7.69 5.5 4.07 3.6 1.64.77A4.64 4.64 0 00.96 3.13c0 1.6.79 3.01 2 3.83A4.52 4.52 0 01.96 6.5v.06c0 2.23 1.54 4.1 3.58 4.53-.37.11-.76.17-1.16.17-.28 0-.56-.03-.83-.08.57 1.79 2.21 3.1 4.16 3.14A9.06 9.06 0 010 19.54a12.8 12.8 0 006.92 2.05c8.3 0 12.85-7.04 12.85-13.14 0-.2 0-.4-.01-.6A9.22 9.22 0 0023 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Sign in to Twitter Clone</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#1DA1F2", // Twitter blue
                  brandAccent: "#0d8ddb",
                },
              },
            },
          }}
          theme="default"
          providers={["github", "google"]}
        />
        <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
          By signing in, you agree to our{" "}
          <a href="#" className="text-blue-500 hover:underline">Terms</a> and{" "}
          <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}
