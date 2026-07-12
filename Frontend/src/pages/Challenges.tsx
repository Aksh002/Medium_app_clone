import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TopBar2 } from "../components/Topbar";
import { useAsyncData, useMyPosts } from "../hooks";
import { api } from "../lib/api";
import type { ChallengeEntry } from "../types";

export default function Challenges() {
  const { slug } = useParams();
  const posts = useMyPosts();
  const [entries, setEntries] = useState<ChallengeEntry[]>([]);
  const [dayNumber, setDayNumber] = useState(1);
  const [postId, setPostId] = useState("");
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    const loadEntries = async () => {
      if (!slug) {
        return;
      }
      try {
        const response = await api.myChallengeEntries(slug);
        setEntries(response.entries);
      } catch {
        setEntries([]);
      }
    };

    void loadEntries();
  }, [slug]);

  const submitEntry = async () => {
    if (!slug || !postId) {
      return;
    }

    await api.submitChallengeEntry(slug, { postId, dayNumber });
    const response = await api.myChallengeEntries(slug);
    setEntries(response.entries);
    setMessage("Challenge entry saved.");
  };

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
            <div className="mt-6 rounded border border-stone-200 bg-[#fffaf0] p-4">
              <h3 className="font-serif text-3xl">Submit progress</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-[120px_1fr_auto]">
                <input type="number" min={1} max={challenge.data.durationDays} value={dayNumber} onChange={(event) => setDayNumber(Number(event.target.value) || 1)} className="rounded border border-stone-300 px-3 py-2" />
                <select value={postId} onChange={(event) => setPostId(event.target.value)} className="rounded border border-stone-300 px-3 py-2">
                  <option value="">Choose a published post</option>
                  {posts.data.filter((post) => post.status === "PUBLISHED").map((post) => (
                    <option key={post.id} value={post.id}>{post.title}</option>
                  ))}
                </select>
                <button onClick={() => void submitEntry()} className="rounded bg-stone-950 px-4 py-2 text-sm font-semibold text-amber-200">Save</button>
              </div>
              {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
              <div className="mt-5 space-y-2">
                {entries.map((entry) => (
                  <div key={entry.id} className="rounded border border-stone-200 bg-white p-3">
                    <span className="font-semibold">Day {entry.dayNumber}</span>
                    {entry.post && <Link to={`/p/${entry.post.slug}`} className="ml-2 underline">{entry.post.title}</Link>}
                  </div>
                ))}
              </div>
            </div>
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
