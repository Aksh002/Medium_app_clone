import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { TopBar2 } from "../components/Topbar";
import { useAsyncData } from "../hooks";
import { api } from "../lib/api";

export default function Series() {
  const { slug = "" } = useParams();
  const series = useAsyncData(null, useCallback(async () => {
    const response = await api.seriesBySlug(slug);
    return response.series;
  }, [slug]));

  return (
    <div className="min-h-screen bg-[#fffaf0] text-stone-950">
      <TopBar2 />
      <main className="mx-auto max-w-5xl px-5 py-8">
        {series.loading && <div>Loading learning path...</div>}
        {series.error && <div className="text-red-700">{series.error}</div>}
        {series.data && (
          <>
            <section className="mb-8 rounded border border-stone-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-700">Learning path</p>
              <h1 className="mt-3 font-serif text-5xl">{series.data.title}</h1>
              <p className="mt-3 text-stone-600">{series.data.description ?? "A curated path through related learning notes."}</p>
            </section>
            <div className="space-y-3">
              {series.data.posts?.map((entry, index) => (
                <Link key={entry.post.id} to={`/p/${entry.post.slug}`} className="block rounded border border-stone-200 bg-white p-5 hover:border-stone-950">
                  <div className="text-sm font-bold text-amber-700">Step {index + 1}</div>
                  <div className="font-serif text-3xl">{entry.post.title}</div>
                  <p className="text-stone-600">{entry.post.subTitle}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
