"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utilities/supabase";
import LogoutButton from "@/components/LogoutButton";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Session check + initial fetch
  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session || error) {
        router.push("/login");
      } else {
        fetchPosts();
      }
    };
    checkSessionAndFetch();
  }, [router]);

  // Realtime posts
  useEffect(() => {
    const channel = supabase
      .channel("realtime:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          console.log("New post:", payload.new);
          const newPost = payload.new;
          setPosts((prev) => [
            {
              id: newPost.id,
              content: newPost.content,
              created_at: newPost.created_at,
              image_url: newPost.image_url,
              user: { username: newPost.profiles?.username || "unknown" },
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Realtime likes
  useEffect(() => {
    const likeChannel = supabase
      .channel("realtime:likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () => fetchPosts()
      )
      .subscribe();
    return () => supabase.removeChannel(likeChannel);
  }, []);

  // Realtime comments
  useEffect(() => {
    const commentChannel = supabase
      .channel("realtime:comments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => fetchPosts()
      )
      .subscribe();
    return () => supabase.removeChannel(commentChannel);
  }, []);

  // Fetch posts
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, content, created_at, image_url, profiles(username)")
      .order("created_at", { ascending: false });
    if (error) console.error("Fetch error:", error);
    else if (data) {
      setPosts(
        data.map((post) => ({
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          image_url: post.image_url,
          user: { username: post.profiles?.username || "unknown" },
        }))
      );
    }
  };

  // Submit new post
  const handlePostSubmit = async () => {
    if (newPost.trim().length === 0) return;
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (!session || sessionError) {
      router.push("/login");
      return;
    }
    const { error } = await supabase.from("posts").insert({
      content: newPost.trim(),
      user_id: session.user.id,
    });
    if (error) alert("Failed to create post. Check console.");
    else setNewPost("");
  };

  // Upload image
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      setUploading(false);
      return;
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase
      .storage.from("post-images")
      .upload(fileName, file);
    if (uploadError) {
      alert("Upload failed.");
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase
      .storage.from("post-images")
      .getPublicUrl(fileName);
    if (!publicUrl) {
      alert("Image URL fetch failed.");
      setUploading(false);
      return;
    }
    const { error: insertError } = await supabase.from("posts").insert({
      content: newPost.trim() || "📷 New photo!",
      user_id: session.user.id,
      image_url: publicUrl,
    });
    if (insertError) alert("Failed to create post with image.");
    else setNewPost("");
    setUploading(false);
  };

  return (
    <main className={`${darkMode ? "bg-black text-white" : "bg-[#f0f2f5] text-black"} flex flex-col items-center min-h-screen p-4 transition-colors`}>
      <div className="w-full max-w-2xl rounded-xl shadow p-4 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
          <h1 className="text-2xl font-bold">Your Feed</h1>
          <div className="flex items-center gap-4">
            <button
              className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <textarea
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="What’s happening?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <button
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-white font-bold py-1 px-3 rounded"
                onClick={handleUploadClick}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Add Image"}
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handlePostSubmit}
            >
              Post
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No posts yet. Start the conversation!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-600">@{post.user?.username || "unknown"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleString()}</span>
                </div>
                <p className="text-base mb-3">{post.content}</p>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post image"
                    className="w-full max-h-96 object-cover rounded mb-3 border dark:border-gray-700"
                  />
                )}
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-sm">
                  <button className="hover:text-blue-500 flex items-center gap-1">❤️ Like</button>
                  <button className="hover:text-blue-500 flex items-center gap-1">💬 Comment</button>
                  <button className="hover:text-blue-500 flex items-center gap-1">🔗 Share</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
