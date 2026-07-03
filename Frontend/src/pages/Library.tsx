import { useCallback } from "react";
import { TopBar2 } from "../components/Topbar";
import { useAuthGuard, useAsyncData } from "../hooks";
import { api } from "../lib/api";

const countItems = (value: unknown) => (Array.isArray(value) ? value.length : 0);

export default function Library() {
  const { checking } = useAuthGuard();
  const library = useAsyncData(
    { bookmarks: [], highlights: [], notes: [], history: [] },
    useCallback(() => api.library(), []),
  );

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
        <a href={`${import.meta.env.VITE_API_BASE_URL ?? "https://backend.akshitgangwar02.workers.dev/api/v1"}/library/export`} className="mt-8 inline-block rounded bg-stone-950 px-5 py-3 text-sm font-semibold text-amber-200">
          Export notes as Markdown
        </a>
      </main>
    </div>
  );
}
