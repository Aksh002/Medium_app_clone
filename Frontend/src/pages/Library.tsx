import { useCallback } from "react";
import { Link } from "react-router-dom";
import { TopBar2 } from "../components/Topbar";
import { useAuthGuard, useAsyncData } from "../hooks";
import { api, tokenStore } from "../lib/api";

const countItems = (value: unknown) => (Array.isArray(value) ? value.length : 0);

export default function Library() {
  const { checking } = useAuthGuard();
  const library = useAsyncData(
    { bookmarks: [], highlights: [], notes: [], history: [] },
    useCallback(() => api.library(), []),
  );

  const exportNotes = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://backend.akshitgangwar02.workers.dev/api/v1";
    const response = await fetch(`${baseUrl}/library/export`, {
      headers: { Authorization: `Bearer ${tokenStore.get()}` },
    });
    const markdown = await response.text();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "learning-library.md";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-[#fffaf0]">Opening library...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-stone-950">
      <TopBar2 />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-8 border-b border-stone-200 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-700">Reader memory</p>
          <h1 className="mt-3 font-serif text-5xl">Your private learning library.</h1>
        </div>
        {library.error && <div className="text-red-700">{library.error}</div>}
        <section className="grid gap-5 md:grid-cols-4">
          {[
            ["Bookmarks", library.data.bookmarks],
            ["Highlights", library.data.highlights],
            ["Private notes", library.data.notes],
            ["Reading history", library.data.history],
          ].map(([label, items]) => (
            <div key={label as string} className="rounded border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-500">{label as string}</p>
              <div className="mt-3 font-serif text-5xl">{countItems(items)}</div>
            </div>
          ))}
        </section>
        <button onClick={() => void exportNotes()} className="mt-8 inline-block rounded bg-stone-950 px-5 py-3 text-sm font-semibold text-amber-200">
          Export notes as Markdown
        </button>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded border border-stone-200 bg-white p-5">
            <h2 className="font-serif text-3xl">Bookmarks</h2>
            <div className="mt-4 space-y-3">
              {library.data.bookmarks.map((item) => (
                <Link key={item.id} to={`/p/${item.post.slug}`} className="block rounded border border-stone-200 p-3 hover:border-stone-950">
                  <div className="font-semibold">{item.post.title}</div>
                  <div className="text-sm text-stone-500">{item.post.readingTime} min read</div>
                </Link>
              ))}
              {!library.data.bookmarks.length && <p className="text-sm text-stone-500">Saved articles will land here.</p>}
            </div>
          </div>

          <div className="rounded border border-stone-200 bg-white p-5">
            <h2 className="font-serif text-3xl">Reading history</h2>
            <div className="mt-4 space-y-3">
              {library.data.history.map((item) => (
                <Link key={item.id} to={`/p/${item.post.slug}`} className="block rounded border border-stone-200 p-3 hover:border-stone-950">
                  <div className="font-semibold">{item.post.title}</div>
                  <div className="mt-2 h-2 rounded bg-stone-100">
                    <div className="h-2 rounded bg-amber-500" style={{ width: `${item.progress}%` }} />
                  </div>
                </Link>
              ))}
              {!library.data.history.length && <p className="text-sm text-stone-500">Progress appears after you read.</p>}
            </div>
          </div>

          <div className="rounded border border-stone-200 bg-white p-5">
            <h2 className="font-serif text-3xl">Highlights</h2>
            <div className="mt-4 space-y-3">
              {library.data.highlights.map((item) => (
                <div key={item.id} className="rounded border border-stone-200 p-3">
                  <p className="text-stone-700">"{item.selectedText}"</p>
                  {item.post && <Link to={`/p/${item.post.slug}`} className="mt-2 block text-sm font-semibold underline">{item.post.title}</Link>}
                </div>
              ))}
              {!library.data.highlights.length && <p className="text-sm text-stone-500">Select text in an article to save a highlight.</p>}
            </div>
          </div>

          <div className="rounded border border-stone-200 bg-white p-5">
            <h2 className="font-serif text-3xl">Private notes</h2>
            <div className="mt-4 space-y-3">
              {library.data.notes.map((item) => (
                <div key={item.id} className="rounded border border-stone-200 p-3">
                  {item.post && <Link to={`/p/${item.post.slug}`} className="font-semibold underline">{item.post.title}</Link>}
                  <p className="mt-2 text-sm text-stone-700">{item.content}</p>
                </div>
              ))}
              {!library.data.notes.length && <p className="text-sm text-stone-500">Your article notes stay private.</p>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
