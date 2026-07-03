import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { TopBar2 } from "../components/Topbar";
import { useAuthGuard } from "../hooks";
import { api } from "../lib/api";

export default function Draft(){
  const { checking } = useAuthGuard();
  const navigate = useNavigate();
  const postIdRef = useRef<string | null>(localStorage.getItem("currentBlogId"));
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("## Today I learned\n\n");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [tagInput, setTagInput] = useState("learning, build-log");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("");
  const [dirty, setDirty] = useState(false);

  const tags = useMemo(
    () =>
      tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagInput],
  );

  const saveDraft = useCallback(async () => {
    if (!title.trim()) {
      setError("A title is required before saving.");
      return null;
    }

    setSaving(true);
    setError("");
    try {
      const payload = { title, subTitle, content, coverImageUrl, tags };
      const response = postIdRef.current
        ? await api.updatePost(postIdRef.current, payload)
        : await api.createPost(payload);
      postIdRef.current = response.post.id;
      localStorage.setItem("currentBlogId", response.post.id);
      setLastSaved(new Date().toLocaleTimeString());
      setDirty(false);
      return response.post;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save draft");
      return null;
    } finally {
      setSaving(false);
    }
  }, [content, coverImageUrl, subTitle, tags, title]);

  const publish = async () => {
    const post = await saveDraft();
    if (!post) {
      return;
    }

    try {
      const published = await api.publishPost(post.id);
      localStorage.removeItem("currentBlogId");
      navigate(`/p/${published.post.slug}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not publish post");
    }
  };

  useEffect(() => {
    const markDirty = () => setDirty(true);
    markDirty();
  }, [title, subTitle, content, coverImageUrl, tagInput]);

  useEffect(() => {
    if (!dirty || !title.trim()) {
      return;
    }

    const id = window.setTimeout(() => {
      void saveDraft();
    }, 5000);

    return () => window.clearTimeout(id);
  }, [dirty, saveDraft, title]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-[#fffaf0]">Checking your desk...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-stone-950">
      <TopBar2 />
      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-700">Markdown desk</p>
              <h1 className="font-serif text-4xl">Write a living article</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => void saveDraft()} className="rounded border border-stone-300 px-4 py-2 text-sm font-semibold">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => void publish()} className="rounded bg-stone-950 px-4 py-2 text-sm font-semibold text-amber-200">
                Publish
              </button>
            </div>
          </div>

          {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {lastSaved && <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Saved at {lastSaved}</div>}

          <div className="space-y-4">
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Article title" className="w-full border-b border-stone-300 bg-transparent pb-3 font-serif text-5xl outline-none" />
            <input value={subTitle} onChange={(event) => setSubTitle(event.target.value)} placeholder="A crisp promise for the reader" className="w-full border-b border-stone-200 bg-transparent pb-3 text-xl outline-none" />
            <input value={coverImageUrl} onChange={(event) => setCoverImageUrl(event.target.value)} placeholder="Cover image URL" className="w-full rounded border border-stone-200 px-3 py-2 outline-none focus:border-stone-950" />
            <input value={tagInput} onChange={(event) => setTagInput(event.target.value)} placeholder="tags, comma separated" className="w-full rounded border border-stone-200 px-3 py-2 outline-none focus:border-stone-950" />
            <textarea value={content} onChange={(event) => setContent(event.target.value)} className="min-h-[520px] w-full resize-y rounded border border-stone-200 bg-[#fffaf0] p-4 font-mono text-sm leading-7 outline-none focus:border-stone-950" />
          </div>
        </section>

        <section className="rounded border border-stone-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-stone-500">Live preview</p>
          {coverImageUrl && <img src={coverImageUrl} alt="" className="mb-6 aspect-[16/9] w-full rounded object-cover" />}
          <article className="prose prose-stone max-w-none">
            <h1>{title || "Untitled learning note"}</h1>
            {subTitle && <p className="lead">{subTitle}</p>}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
        </section>
      </main>
    </div>
  );
}
