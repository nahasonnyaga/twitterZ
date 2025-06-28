"use client";

import { useContext } from "react";
import DebugSession from "@/components/debug-session";
import { useQuery } from "@tanstack/react-query";

import Tweets from "@/components/tweet/Tweets";
import { getRelatedTweets } from "@/utilities/fetch";
import CircularLoading from "@/components/misc/CircularLoading";
import NothingToShow from "@/components/misc/NothingToShow";
import NewTweet from "@/components/tweet/NewTweet";
import { AuthContext } from "../layout";

export default function HomePage() {
  const { token, isPending } = useContext(AuthContext);

  const { isLoading, data } = useQuery({
    queryKey: ["tweets", "home"],
    queryFn: getRelatedTweets,
  });

  if (isPending || isLoading) {
    return <CircularLoading />;
  }

  return (
    <>
      <DebugSession /> {/* Shows session in browser console */}
      <main>
        <h1 className="page-name">Home</h1>
        {token && <NewTweet token={token} />}
        {data && data.tweets.length === 0 && <NothingToShow />}
        {data && data.tweets.length > 0 && <Tweets tweets={data.tweets} />}
      </main>
    </>
  );
}
