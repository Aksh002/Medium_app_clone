import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { TopBar2 } from "../components/Topbar";
import { useAsyncData } from "../hooks";
import { api } from "../lib/api";

export default function Challenges() {
  const { slug } = useParams();
  const challengeList = useAsyncData([], useCallback(async () => {
    const response = await api.challenges();
    return response.challenges;
  }, []));
  const challenge = useAsyncData(null, useCallback(async () => {
    if (!slug) {
      return null;
    }
    const response = await api.challenge(slug);
    return response.challenge;
  }, [slug]));

  return (
    <div className="min-h-screen bg-[#fffaf0] text-stone-950">
      <TopBar2 />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <section className="mb-8 border-b border-stone-200 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-700">Learning loops</p>
          <h1 className="mt-3 font-serif text-5xl">Challenges that keep you shipping.</h1>
        </section>

        {slug && challenge.data ? (
          <section className="rounded border border-stone-200 bg-white p-6">
            <h2 className="font-serif text-4xl">{challenge.data.title}</h2>
            <p className="mt-3 max-w-2xl text-stone-600">{challenge.data.description}</p>
            <div className="mt-5 rounded bg-amber-50 p-4 text-amber-950">
              Prompt: {challenge.data.promptTemplate}
            </div>
            <Link to="/write" className="mt-5 inline-block rounded bg-stone-950 px-5 py-3 text-sm font-semibold text-amber-200">
              Write an entry
            </Link>
          </section>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {challengeList.data.map((item) => (
              <Link key={item.slug} to={`/challenges/${item.slug}`} className="rounded border border-stone-200 bg-white p-6 hover:border-stone-950">
                <div className="text-sm font-bold text-amber-700">{item.durationDays} days</div>
                <h2 className="mt-2 font-serif text-3xl">{item.title}</h2>
                <p className="mt-2 text-stone-600">{item.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
