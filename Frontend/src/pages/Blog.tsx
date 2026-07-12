import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import BookMark from "../components/BookMark";
import Like from "../components/Like";
import { TopBar2 } from "../components/Topbar";
import { api } from "../lib/api";
import type { Comment, Post, Revision, SeriesContext } from "../types";

export default function Blog(){
  const { slug, blogId } = useParams();
  const navigate = useNavigate();
  const postSlug = slug ?? blogId ?? "";
  const [blog, setBlog] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [seriesContexts, setSeriesContexts] = useState<SeriesContext[]>([]);
  const [comment, setComment] = useState("");
  const [note, setNote] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [readProgress, setReadProgress] = useState(0);
  const [updatedSinceLastRead, setUpdatedSinceLastRead] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = useMemo(() => localStorage.getItem("userName") ?? "", []);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await api.postBySlug(postSlug);
        setBlog(response.post);
        const [commentResponse, revisionResponse, noteResponse, seriesResponse] = await Promise.allSettled([
          api.comments(response.post.id),
          api.revisions(response.post.id),
          api.privateNote(response.post.id),
          api.seriesContext(response.post.id),
        ]);
        if (commentResponse.status === "fulfilled") {
          setComments(commentResponse.value.comments);
        }
        if (revisionResponse.status === "fulfilled") {
          setRevisions(revisionResponse.value.revisions);
          const readKey = `post:${response.post.id}:revisionCount`;
          const lastReadCount = Number(localStorage.getItem(readKey) ?? "0");
          setUpdatedSinceLastRead(revisionResponse.value.revisions.length > lastReadCount);
        }
        if (noteResponse.status === "fulfilled") {
          const savedNote = noteResponse.value.note as { content?: string } | null;
          setNote(savedNote?.content ?? "");
        }
        if (seriesResponse.status === "fulfilled") {
          setSeriesContexts(seriesResponse.value.contexts);
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Failed to fetch article");
      } finally {
        setLoading(false);
      }
    };

    if (postSlug) {
      void fetchBlog();
    }
  }, [postSlug]);

  useEffect(() => {
    if (!blog) {
      return;
    }

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100;
      setReadProgress(progress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [blog]);

  useEffect(() => {
    if (!blog || readProgress < 10) {
      return;
    }

    const id = window.setTimeout(() => {
      void api.readingProgress(blog.id, readProgress);
      if (readProgress >= 85) {
        localStorage.setItem(`post:${blog.id}:revisionCount`, String(revisions.length));
        setUpdatedSinceLastRead(false);
      }
    }, 800);

    return () => window.clearTimeout(id);
  }, [blog, readProgress, revisions.length]);

  const toggleLike = async () => {
    if (!blog) {
      return;
    }
    const next = blog.likedByViewer ? await api.unlikePost(blog.id) : await api.likePost(blog.id);
    setBlog({
      ...blog,
      likedByViewer: next.liked,
      _count: {
        comments: blog._count?.comments ?? 0,
        bookmarks: blog._count?.bookmarks ?? 0,
        likes: Math.max(0, (blog._count?.likes ?? 0) + (next.liked ? 1 : -1)),
      },
    });
  };

  const toggleBookmark = async () => {
    if (!blog) {
      return;
    }
    const next = blog.bookmarkedByViewer ? await api.unbookmarkPost(blog.id) : await api.bookmarkPost(blog.id);
    setBlog({ ...blog, bookmarkedByViewer: next.bookmarked });
  };

  const addComment = async () => {
    if (!blog || !comment.trim()) {
      return;
    }
    const response = await api.addComment(blog.id, comment);
    setComments((items) => [...items, response.comment]);
    setComment("");
  };

  const removeComment = async (commentId: string) => {
    if (!blog) {
      return;
    }

    await api.deleteComment(blog.id, commentId);
    setComments((items) => items.filter((item) => item.id !== commentId));
  };

  const saveNote = async () => {
    if (blog) {
      await api.savePrivateNote(blog.id, note);
    }
  };

  const saveSelection = async () => {
    const selectedText = window.getSelection()?.toString().trim();
    if (blog && selectedText) {
      await api.addHighlight(blog.id, selectedText);
    }
  };

  const restoreRevision = async (version: number) => {
    if (!blog) {
      return;
    }

    const response = await api.restoreRevision(blog.id, version);
    setBlog(response.post);
  };

  const submitReport = async () => {
    if (!blog || !reportReason.trim()) {
      return;
    }

    await api.report({ postId: blog.id, reason: reportReason });
    setReportReason("");
  };

  const deletePost = async () => {
    if (!blog) {
      return;
    }

    await api.deletePost(blog.id);
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#fffaf0]">Loading article...</div>;
  }

  if (error || !blog) {
    return <div className="grid min-h-screen place-items-center bg-[#fffaf0] text-red-700">{error || "Article not found"}</div>;
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-stone-950">
      <div className="fixed left-0 top-0 z-50 h-1 bg-amber-500 transition-all" style={{ width: `${readProgress}%` }} />
      <TopBar2 />
      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[minmax(0,760px)_320px]">
        <article className="rounded border border-stone-200 bg-white p-6 shadow-sm">
          {blog.coverImageUrl && <img src={blog.coverImageUrl} alt="" className="mb-8 aspect-[16/9] w-full rounded object-cover" />}
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap gap-2">
              {blog.tags?.map((tag) => (
                <Link key={tag.slug} to={`/tag/${tag.slug}`} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  {tag.name}
                </Link>
              ))}
            </div>
            <h1 className="font-serif text-5xl leading-tight">{blog.title}</h1>
            <p className="mt-3 text-xl text-stone-600">{blog.subTitle}</p>
            {updatedSinceLastRead && (
              <div className="mt-4 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950">
                Updated since your last full read. Check the revision notes before continuing.
              </div>
            )}
            <div className="mt-5 flex items-center gap-3 text-sm text-stone-500">
              <Link to={`/u/${blog.author?.userName ?? ""}`} className="font-semibold text-stone-900">
                {blog.author?.firstName ?? "Learning writer"}
              </Link>
              <span>{blog.readingTime} min read</span>
              {revisions.length > 0 && <span>Updated {revisions.length} time{revisions.length > 1 ? "s" : ""}</span>}
            </div>
          </div>

          <div className="mb-8 flex items-center justify-between border-y border-stone-200 py-3">
            <Like active={Boolean(blog.likedByViewer)} count={blog._count?.likes ?? 0} onToggle={() => void toggleLike()} />
            <button onClick={() => void saveSelection()} className="rounded border border-stone-300 px-3 py-2 text-sm font-semibold">
              Save highlight
            </button>
            <BookMark active={Boolean(blog.bookmarkedByViewer)} onToggle={() => void toggleBookmark()} />
          </div>

          <div className="prose prose-stone max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>{blog.content}</ReactMarkdown>
          </div>

          {seriesContexts.length > 0 && (
            <section className="mt-10 border-t border-stone-200 pt-6">
              <h2 className="font-serif text-3xl">Learning path</h2>
              <div className="mt-4 space-y-4">
                {seriesContexts.map((context) => (
                  <div key={context.series.id} className="rounded border border-stone-200 bg-[#fffaf0] p-4">
                    <Link to={`/series/${context.series.slug}`} className="font-semibold underline">
                      {context.series.title}
                    </Link>
                    <div className="mt-2 text-sm text-stone-600">
                      Step {context.progress.current} of {context.progress.total}
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {context.previous && (
                        <Link to={`/p/${context.previous.slug}`} className="rounded border border-stone-200 bg-white p-3 hover:border-stone-950">
                          <div className="text-xs font-bold uppercase text-stone-500">Previous</div>
                          <div className="font-semibold">{context.previous.title}</div>
                        </Link>
                      )}
                      {context.next && (
                        <Link to={`/p/${context.next.slug}`} className="rounded border border-stone-200 bg-white p-3 hover:border-stone-950">
                          <div className="text-xs font-bold uppercase text-stone-500">Next</div>
                          <div className="font-semibold">{context.next.title}</div>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10 border-t border-stone-200 pt-6">
            <h2 className="font-serif text-3xl">Conversation</h2>
            <div className="mt-4 flex gap-2">
              <input value={comment} onChange={(event) => setComment(event.target.value)} className="flex-1 rounded border border-stone-300 px-3 py-2 outline-none focus:border-stone-950" placeholder="Add a thoughtful comment" />
              <button onClick={() => void addComment()} className="rounded bg-stone-950 px-4 py-2 text-sm font-semibold text-amber-200">Post</button>
            </div>
            <div className="mt-5 space-y-3">
              {comments.map((item) => (
                <div key={item.id} className="rounded border border-stone-200 bg-[#fffaf0] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{item.author.firstName}</div>
                    {item.author.userName === currentUser && (
                      <button onClick={() => void removeComment(item.id)} className="text-xs font-semibold text-red-700">
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-stone-700">{item.content}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-5">
          <section className="rounded border border-stone-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500">Private note</p>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-3 min-h-40 w-full rounded border border-stone-200 p-3 text-sm outline-none focus:border-stone-950" placeholder="What should future-you remember?" />
            <button onClick={() => void saveNote()} className="mt-3 rounded bg-stone-950 px-4 py-2 text-sm font-semibold text-amber-200">Save note</button>
          </section>
          <section className="rounded border border-stone-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500">Revision timeline</p>
            <div className="mt-4 space-y-3">
              {revisions.length ? revisions.map((revision) => (
                <div key={revision.id} className="border-l-2 border-amber-300 pl-3">
                  <div className="font-semibold">Version {revision.version}</div>
                  <div className="text-sm text-stone-600">{revision.changeNote ?? "Article updated"}</div>
                  <button onClick={() => void restoreRevision(revision.version)} className="mt-2 text-xs font-semibold underline">
                    Restore
                  </button>
                </div>
              )) : <p className="text-sm text-stone-600">No revisions yet. This article is still in its first life.</p>}
            </div>
          </section>
          <section className="rounded border border-stone-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500">Moderation</p>
            <textarea value={reportReason} onChange={(event) => setReportReason(event.target.value)} className="mt-3 min-h-24 w-full rounded border border-stone-200 p-3 text-sm outline-none focus:border-stone-950" placeholder="Report a concern" />
            <button onClick={() => void submitReport()} className="mt-3 rounded border border-stone-300 px-4 py-2 text-sm font-semibold">Report</button>
            {blog.author?.userName === currentUser && (
              <button onClick={() => void deletePost()} className="mt-3 block text-sm font-semibold text-red-700">
                Delete article
              </button>
            )}
          </section>
        </aside>
      </main>
    </div>
  );
}
