import { useState } from "react";
import { Link } from "react-router-dom";
import { TopBar2 } from "../components/Topbar";
import { useAuthGuard, useDrafts, useMyPosts } from "../hooks";
import { api } from "../lib/api";

export default function Dashboard(){
  const { checking } = useAuthGuard();
  const drafts = useDrafts();
  const posts = useMyPosts();
  const [seriesTitle, setSeriesTitle] = useState("");
  const [message, setMessage] = useState("");

  const createSeries = async () => {
    if (!seriesTitle.trim()) {
      return;
    }
    const response = await api.createSeries({ title: seriesTitle });
    setMessage(`Series created: ${response.series.title}`);
    setSeriesTitle("");
  };

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-[#fffaf0]">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-stone-950">
      <TopBar2 />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-stone-200 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-700">Writer cockpit</p>
            <h1 className="mt-3 font-serif text-5xl">Keep your knowledge moving.</h1>
          </div>
          <Link to="/write" className="rounded bg-stone-950 px-5 py-3 text-sm font-semibold text-amber-200">New article</Link>
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold text-stone-500">Published</p>
            <div className="mt-3 font-serif text-5xl">{posts.data.filter((post) => post.status === "PUBLISHED").length}</div>
          </div>
          <div className="rounded border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold text-stone-500">Drafts</p>
            <div className="mt-3 font-serif text-5xl">{drafts.data.length}</div>
          </div>
          <div className="rounded border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">Today&apos;s prompt</p>
            <div className="mt-3 font-serif text-2xl">Explain one thing you finally understood.</div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded border border-stone-200 bg-white p-5">
            <h2 className="font-serif text-3xl">Your articles</h2>
            <div className="mt-5 space-y-3">
              {posts.data.map((post) => (
                <Link key={post.id} to={post.slug ? `/p/${post.slug}` : "/blogs"} className="block rounded border border-stone-200 p-4 hover:border-stone-950">
                  <div className="font-semibold">{post.title}</div>
                  <div className="text-sm text-stone-500">{post.status} · {post.readingTime} min read</div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded border border-stone-200 bg-white p-5">
              <h2 className="font-serif text-3xl">Create series</h2>
              <p className="mt-2 text-sm text-stone-600">Group articles into a learning path.</p>
              <input value={seriesTitle} onChange={(event) => setSeriesTitle(event.target.value)} className="mt-4 w-full rounded border border-stone-300 px-3 py-2 outline-none focus:border-stone-950" placeholder="React from zero" />
              <button onClick={() => void createSeries()} className="mt-3 rounded bg-stone-950 px-4 py-2 text-sm font-semibold text-amber-200">Create</button>
              {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
            </div>
            <div className="rounded border border-stone-200 bg-white p-5">
              <h2 className="font-serif text-3xl">Drafts</h2>
              <div className="mt-4 space-y-3">
                {drafts.data.map((post) => (
                  <div key={post.id} className="rounded border border-stone-200 p-3">
                    <div className="font-semibold">{post.title}</div>
                    <div className="text-sm text-stone-500">Last touched {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "recently"}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
