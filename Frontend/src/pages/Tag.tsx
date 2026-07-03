import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { BlogPrev } from "../components/BlogPrev";
import { TopBar2 } from "../components/Topbar";
import { useAsyncData } from "../hooks";
import { api } from "../lib/api";

export default function Tag() {
  const { tag = "" } = useParams();
  const posts = useAsyncData([], useCallback(async () => {
    const response = await api.posts();
    return response.posts.filter((post) => post.tags?.some((item) => item.slug === tag));
  }, [tag]));

  return (
    <div className="min-h-screen bg-[#fffaf0] text-stone-950">
      <TopBar2 />
      <main className="mx-auto max-w-5xl px-5 py-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-700">Topic</p>
        <h1 className="mt-3 font-serif text-5xl">#{tag}</h1>
        <div className="mt-8 space-y-5">
          {posts.data.map((post) => <BlogPrev key={post.id} blog={post} />)}
        </div>
      </main>
    </div>
  );
}
