import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BlogPrev } from "../components/BlogPrev";
import { TopBar2 } from "../components/Topbar";
import { useAsyncData } from "../hooks";
import { api } from "../lib/api";

export default function Profile() {
  const { userName = "" } = useParams();
  const [following, setFollowing] = useState(false);
  const profile = useAsyncData(null, useCallback(async () => {
    const response = await api.profile(userName);
    setFollowing(Boolean(response.user.followedByViewer));
    return response.user;
  }, [userName]));

  const toggleFollow = async () => {
    if (!profile.data) {
      return;
    }
    const response = following ? await api.unfollow(profile.data.userName) : await api.follow(profile.data.userName);
    setFollowing(response.following);
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] text-stone-950">
      <TopBar2 />
      <main className="mx-auto max-w-6xl px-5 py-8">
        {profile.loading && <div>Loading profile...</div>}
        {profile.error && <div className="text-red-700">{profile.error}</div>}
        {profile.data && (
          <>
            <section className="mb-8 rounded border border-stone-200 bg-white p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-700">Public notebook</p>
                  <h1 className="mt-2 font-serif text-5xl">{profile.data.firstName}</h1>
                  <p className="mt-2 text-stone-600">@{profile.data.userName}</p>
                  <p className="mt-4 max-w-2xl text-stone-700">{profile.data.bio ?? "Learning in public, one article at a time."}</p>
                </div>
                <button onClick={() => void toggleFollow()} className="rounded bg-stone-950 px-5 py-3 text-sm font-semibold text-amber-200">
                  {following ? "Following" : "Follow"}
                </button>
              </div>
            </section>
            <section className="space-y-5">
              {profile.data.posts.length ? profile.data.posts.map((post) => <BlogPrev key={post.id} blog={post} />) : (
                <div className="rounded border border-dashed border-stone-300 bg-white p-8 text-center">
                  <p>No public articles yet.</p>
                  <Link to="/blogs" className="mt-3 inline-block text-sm font-semibold underline">Back to feed</Link>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
