import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TopBar2 } from "../components/Topbar";
import { useAuthGuard, useDrafts, useMyPosts } from "../hooks";
import { api } from "../lib/api";
import type { Notification, Series, WriterAnalytics } from "../types";

export default function Dashboard(){
  const { checking } = useAuthGuard();
  const drafts = useDrafts();
  const posts = useMyPosts();
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [analytics, setAnalytics] = useState<WriterAnalytics | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState("");

  const publishedPosts = useMemo(() => posts.data.filter((post) => post.status === "PUBLISHED"), [posts.data]);
  const selectedSeries = useMemo(
    () => seriesList.find((series) => series.id === selectedSeriesId) ?? seriesList[0],
    [selectedSeriesId, seriesList],
  );

  const refreshWorkbench = useCallback(async () => {
    const [seriesResponse, analyticsResponse, notificationResponse] = await Promise.allSettled([
      api.mySeries(),
      api.writerAnalytics(),
      api.notifications(),
    ]);

    if (seriesResponse.status === "fulfilled") {
      setSeriesList(seriesResponse.value.series);
      setSelectedSeriesId((current) => current || seriesResponse.value.series[0]?.id || "");
    }
    if (analyticsResponse.status === "fulfilled") {
      setAnalytics(analyticsResponse.value);
    }
    if (notificationResponse.status === "fulfilled") {
      setNotifications(notificationResponse.value.notifications);
    }
  }, []);

  useEffect(() => {
    if (!checking) {
      void refreshWorkbench();
    }
  }, [checking, refreshWorkbench]);

  const createSeries = async () => {
    if (!seriesTitle.trim()) {
      return;
    }
    const response = await api.createSeries({ title: seriesTitle });
    setMessage(`Series created: ${response.series.title}`);
    setSeriesTitle("");
    await refreshWorkbench();
  };

  const addPostToSeries = async () => {
    if (!selectedSeries || !selectedPostId) {
      return;
    }

    await api.addSeriesPost(selectedSeries.id, {
      postId: selectedPostId,
      order: (selectedSeries.posts?.length ?? 0) + 1,
    });
    setSelectedPostId("");
    setMessage("Article added to series.");
    await refreshWorkbench();
  };

  const removePostFromSeries = async (postId: string) => {
    if (!selectedSeries) {
      return;
    }

    await api.removeSeriesPost(selectedSeries.id, postId);
    setMessage("Article removed from series.");
    await refreshWorkbench();
  };

  const moveSeriesPost = async (postId: string, direction: -1 | 1) => {
    if (!selectedSeries?.posts) {
      return;
    }

    const ids = selectedSeries.posts.map((entry) => entry.post.id);
    const index = ids.indexOf(postId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ids.length) {
      return;
    }
    const [moved] = ids.splice(index, 1);
    ids.splice(target, 0, moved);
    await api.reorderSeries(selectedSeries.id, ids);
    setMessage("Series order updated.");
    await refreshWorkbench();
  };

  const markNotificationsRead = async () => {
    await api.markNotificationsRead();
    await refreshWorkbench();
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

        <section className="grid gap-5 md:grid-cols-4">
          <div className="rounded border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold text-stone-500">Published</p>
            <div className="mt-3 font-serif text-5xl">{analytics?.summary.published ?? publishedPosts.length}</div>
          </div>
          <div className="rounded border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold text-stone-500">Drafts</p>
            <div className="mt-3 font-serif text-5xl">{analytics?.summary.drafts ?? drafts.data.length}</div>
          </div>
          <div className="rounded border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold text-stone-500">Reads</p>
            <div className="mt-3 font-serif text-5xl">{analytics?.summary.reads ?? 0}</div>
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
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-3xl">Notifications</h2>
                <button onClick={() => void markNotificationsRead()} className="text-xs font-semibold underline">Mark read</button>
              </div>
              <div className="mt-4 space-y-3">
                {notifications.slice(0, 5).map((item) => (
                  <div key={item.id} className={`rounded border p-3 text-sm ${item.read ? "border-stone-200 text-stone-500" : "border-amber-300 bg-amber-50 text-amber-950"}`}>
                    {item.message}
                  </div>
                ))}
                {!notifications.length && <p className="text-sm text-stone-500">No notifications yet.</p>}
              </div>
            </div>
            <div className="rounded border border-stone-200 bg-white p-5">
              <h2 className="font-serif text-3xl">Create series</h2>
              <p className="mt-2 text-sm text-stone-600">Group articles into a learning path.</p>
              <input value={seriesTitle} onChange={(event) => setSeriesTitle(event.target.value)} className="mt-4 w-full rounded border border-stone-300 px-3 py-2 outline-none focus:border-stone-950" placeholder="React from zero" />
              <button onClick={() => void createSeries()} className="mt-3 rounded bg-stone-950 px-4 py-2 text-sm font-semibold text-amber-200">Create</button>
              {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
            </div>
            <div className="rounded border border-stone-200 bg-white p-5">
              <h2 className="font-serif text-3xl">Series manager</h2>
              <select value={selectedSeries?.id ?? ""} onChange={(event) => setSelectedSeriesId(event.target.value)} className="mt-4 w-full rounded border border-stone-300 px-3 py-2">
                {seriesList.map((series) => (
                  <option key={series.id} value={series.id}>{series.title}</option>
                ))}
              </select>
              <div className="mt-3 flex gap-2">
                <select value={selectedPostId} onChange={(event) => setSelectedPostId(event.target.value)} className="min-w-0 flex-1 rounded border border-stone-300 px-3 py-2">
                  <option value="">Choose article</option>
                  {publishedPosts.map((post) => (
                    <option key={post.id} value={post.id}>{post.title}</option>
                  ))}
                </select>
                <button onClick={() => void addPostToSeries()} className="rounded bg-stone-950 px-3 py-2 text-sm font-semibold text-amber-200">Add</button>
              </div>
              <div className="mt-4 space-y-2">
                {selectedSeries?.posts?.map((entry, index) => (
                  <div key={entry.post.id} className="rounded border border-stone-200 p-3">
                    <div className="font-semibold">{index + 1}. {entry.post.title}</div>
                    <div className="mt-2 flex gap-3 text-xs font-semibold">
                      <button onClick={() => void moveSeriesPost(entry.post.id, -1)}>Up</button>
                      <button onClick={() => void moveSeriesPost(entry.post.id, 1)}>Down</button>
                      <button onClick={() => void removePostFromSeries(entry.post.id)} className="text-red-700">Remove</button>
                    </div>
                  </div>
                ))}
                {!selectedSeries?.posts?.length && <p className="text-sm text-stone-500">Add published posts to build the path.</p>}
              </div>
            </div>
            <div className="rounded border border-stone-200 bg-white p-5">
              <h2 className="font-serif text-3xl">Analytics</h2>
              <p className="mt-2 text-sm text-stone-600">Completion rate: {analytics?.summary.completionRate ?? 0}%</p>
              <div className="mt-4 space-y-3">
                {analytics?.mostReadPosts.map((post) => (
                  <Link key={post.id} to={`/p/${post.slug}`} className="block rounded border border-stone-200 p-3 hover:border-stone-950">
                    <div className="font-semibold">{post.title}</div>
                    <div className="text-xs text-stone-500">{post.reads} reads · {post.bookmarks} saves · {post.comments} comments</div>
                  </Link>
                ))}
              </div>
              {Boolean(analytics?.updateCandidates.length) && (
                <div className="mt-5 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                  {analytics?.updateCandidates.length} published article{analytics?.updateCandidates.length === 1 ? "" : "s"} may need an update.
                </div>
              )}
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
