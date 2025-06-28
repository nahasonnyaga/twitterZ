import AuthChecker from "@/components/auth-checker";

export default function HomePage() {
  return (
    <>
      <AuthChecker />
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome to your App!</h1>
      </main>
    </>
  );
}
