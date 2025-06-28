"use client";

import { useQuery } from "@tanstack/react-query";
import CircularLoading from "@/components/misc/CircularLoading";
import NotFound from "@/components/misc/NotFound";
import { fetchUserProfile } from "@/utilities/fetch";

export default function ProfileLayout({ children, params }) {
  const { username } = params;

  const { data, isLoading, isError, isFetched } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => fetchUserProfile(username),
  });

  if (isLoading) return <CircularLoading />;

  if (isError) return <NotFound />;

  // 🔥 FIX: check if data is undefined or user is missing
  if (isFetched && (!data || !data.user)) return <NotFound />;

  return (
    <div className="profile-layout">
      {/* You can use data.user safely below */}
      <header>
        <h1>@{data.user.username}</h1>
      </header>
      {children}
    </div>
  );
}
