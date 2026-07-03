import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BlogPrev } from "../components/BlogPrev";
import { TopBar2 } from "../components/Topbar";
import { useAuthGuard, useDrafts, useMyPosts, usePosts } from "../hooks";

export default function Blogs(){
  const { checking } = useAuthGuard();
  const [view, setView] = useState<"feed" | "drafts" | "mine">("feed");
  const feed = usePosts();
  const drafts = useDrafts();
  const mine = useMyPosts();

  const current = useMemo(() => {
    if (view === "drafts") {
      return drafts;
    }
    if (view === "mine") {
      return mine;
    }
    return feed;
  }, [drafts, feed, mine, view]);

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-[#fffaf0]">Checking your session...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-stone-950">
      <TopBar2 />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <section className="mb-8 grid gap-6 border-b border-stone-200 pb-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-700">Learning in public</p>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
              Articles that keep growing after publish.
            </h1>
          </div>
          <div className="self-end rounded border border-stone-200 bg-white p-5">
            <p className="text-sm leading-7 text-stone-600">
              Use Ledger as a public workbench: write Markdown notes, publish build logs, collect revisions, and shape posts into learning paths.
            </p>
            <Link to="/write" className="mt-5 inline-block rounded bg-stone-950 px-5 py-3 text-sm font-semibold text-amber-200">
              Write today&apos;s note
            </Link>
          </div>
        </section>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["feed", "drafts", "mine"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize ${
                view === item ? "border-stone-950 bg-stone-950 text-amber-200" : "border-stone-300 bg-white"
              }`}
            >
              {item === "mine" ? "My posts" : item}
            </button>
          ))}
        </div>

        {current.error && <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{current.error}</div>}
        {current.loading ? (
          <div className="rounded border border-stone-200 bg-white p-8">Loading the reading desk...</div>
        ) : current.data.length ? (
          <div className="space-y-5">
            {current.data.map((blog) => <BlogPrev key={blog.id} blog={blog} />)}
          </div>
        ) : (
          <div className="rounded border border-dashed border-stone-300 bg-white p-10 text-center">
            <h2 className="font-serif text-3xl">Nothing here yet.</h2>
            <p className="mt-2 text-stone-600">A fresh notebook is not a problem. It is an invitation.</p>
          </div>
        )}
      </main>
    </div>
  );
}
