import { Hono } from "hono";
import {
  authMiddleware,
  fail,
  getOptionalUserId,
  normalizePost,
  ok,
  parseBody,
  parseStringArray,
  postInclude,
  prismaMiddleware,
  readingTime,
  slugify,
  syncTags,
  uniqueSlug,
} from "./utils";

const Posts = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
  Variables: { userId: string; prisma: import("@prisma/client/edge").PrismaClient };
}>();

type PostBody = {
  title: string;
  subTitle: string;
  content: string;
  coverImageUrl: string;
  tags: string[];
  changeNote: string;
};

type CommentBody = {
  content: string;
  parentId: string;
};

type ReadingBody = {
  progress: number;
  lastReadRevisionId: string;
};

type HighlightBody = {
  selectedText: string;
  startOffset: number;
  endOffset: number;
  note: string;
};

type NoteBody = {
  content: string;
};

const notify = async (
  prisma: import("@prisma/client/edge").PrismaClient,
  input: {
    userId: string;
    actorId?: string | null;
    postId?: string | null;
    type: "LIKE" | "BOOKMARK" | "COMMENT" | "REVISION";
    message: string;
  },
) => {
  if (input.userId === input.actorId) {
    return;
  }

  await prisma.notifications.create({
    data: {
      userId: input.userId,
      actorId: input.actorId ?? null,
      postId: input.postId ?? null,
      type: input.type,
      message: input.message,
    },
  });
};

Posts.use("*", prismaMiddleware);

Posts.get("/", async (c) => {
  const viewerId = await getOptionalUserId(c);
  const tag = c.req.query("tag");
  const posts = await c.var.prisma.posts.findMany({
    where: {
      status: "PUBLISHED",
      ...(tag
        ? {
            tags: {
              some: { tag: { slug: slugify(tag) } },
            },
          }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: postInclude(viewerId),
  });

  return c.json(ok({ posts: posts.map(normalizePost) }));
});

Posts.get("/drafts", authMiddleware, async (c) => {
  const posts = await c.var.prisma.posts.findMany({
    where: { authorId: c.get("userId"), status: "DRAFT" },
    orderBy: { updatedAt: "desc" },
    include: postInclude(c.get("userId")),
  });

  return c.json(ok({ posts: posts.map(normalizePost) }));
});

Posts.get("/mine", authMiddleware, async (c) => {
  const posts = await c.var.prisma.posts.findMany({
    where: { authorId: c.get("userId") },
    orderBy: { updatedAt: "desc" },
    include: postInclude(c.get("userId")),
  });

  return c.json(ok({ posts: posts.map(normalizePost) }));
});

Posts.post("/", authMiddleware, async (c) => {
  const body = await parseBody<PostBody>(c);
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "Untitled learning note";
  const content = typeof body.content === "string" ? body.content : "";
  const slug = await uniqueSlug(c.var.prisma, title);

  const post = await c.var.prisma.posts.create({
    data: {
      title,
      subTitle: typeof body.subTitle === "string" ? body.subTitle : "",
      content,
      slug,
      coverImageUrl: typeof body.coverImageUrl === "string" && body.coverImageUrl ? body.coverImageUrl : null,
      readingTime: readingTime(content),
      authorId: c.get("userId"),
    },
  });

  await syncTags(c.var.prisma, post.id, parseStringArray(body.tags));

  const created = await c.var.prisma.posts.findUnique({
    where: { id: post.id },
    include: postInclude(c.get("userId")),
  });

  return c.json(ok({ post: normalizePost(created) }));
});

Posts.put("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const body = await parseBody<PostBody>(c);
  const existing = await c.var.prisma.posts.findFirst({
    where: { id, authorId: c.get("userId") },
    include: { _count: { select: { revisions: true } } },
  });

  if (!existing) {
    c.status(404);
    return c.json(fail("Post not found", "NOT_FOUND"));
  }

  if (existing.status === "PUBLISHED") {
    await c.var.prisma.postRevisions.create({
      data: {
        postId: existing.id,
        version: existing._count.revisions + 1,
        title: existing.title,
        subTitle: existing.subTitle,
        content: existing.content,
        changeNote: typeof body.changeNote === "string" ? body.changeNote : "Article updated",
      },
    });

    await notify(c.var.prisma, {
      userId: existing.authorId,
      actorId: c.get("userId"),
      postId: existing.id,
      type: "REVISION",
      message: `${existing.title} was updated.`,
    });
  }

  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : existing.title;
  const slug = title !== existing.title ? await uniqueSlug(c.var.prisma, title, id) : existing.slug;
  const content = typeof body.content === "string" ? body.content : existing.content;

  await c.var.prisma.posts.update({
    where: { id_authorId: { id, authorId: c.get("userId") } },
    data: {
      title,
      slug,
      subTitle: typeof body.subTitle === "string" ? body.subTitle : existing.subTitle,
      content,
      coverImageUrl:
        typeof body.coverImageUrl === "string"
          ? body.coverImageUrl || null
          : existing.coverImageUrl,
      readingTime: readingTime(content),
    },
  });

  await syncTags(c.var.prisma, id, parseStringArray(body.tags));

  const post = await c.var.prisma.posts.findUnique({
    where: { id },
    include: postInclude(c.get("userId")),
  });

  return c.json(ok({ post: normalizePost(post) }));
});

Posts.delete("/:id", authMiddleware, async (c) => {
  const deleted = await c.var.prisma.posts.deleteMany({
    where: { id: c.req.param("id"), authorId: c.get("userId") },
  });

  if (!deleted.count) {
    c.status(404);
    return c.json(fail("Post not found", "NOT_FOUND"));
  }

  return c.json(ok({ deleted: true }));
});

Posts.post("/:id/publish", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const post = await c.var.prisma.posts.update({
    where: { id_authorId: { id, authorId: c.get("userId") } },
    data: {
      status: "PUBLISHED",
      published: true,
      publishedAt: new Date(),
    },
    include: postInclude(c.get("userId")),
  });

  return c.json(ok({ post: normalizePost(post) }));
});

Posts.get("/:id/revisions", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const post = await c.var.prisma.posts.findFirst({
    where: { id, authorId: c.get("userId") },
    select: { id: true },
  });

  if (!post) {
    c.status(404);
    return c.json(fail("Post not found", "NOT_FOUND"));
  }

  const revisions = await c.var.prisma.postRevisions.findMany({
    where: { postId: id },
    orderBy: { version: "desc" },
  });

  return c.json(ok({ revisions }));
});

Posts.get("/:id/revisions/:version", authMiddleware, async (c) => {
  const version = Number(c.req.param("version"));
  const revision = await c.var.prisma.postRevisions.findFirst({
    where: {
      postId: c.req.param("id"),
      version,
      post: { authorId: c.get("userId") },
    },
  });

  if (!revision) {
    c.status(404);
    return c.json(fail("Revision not found", "NOT_FOUND"));
  }

  return c.json(ok({ revision }));
});

Posts.post("/:id/revisions/:version/restore", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const version = Number(c.req.param("version"));
  const revision = await c.var.prisma.postRevisions.findFirst({
    where: { postId: id, version, post: { authorId: c.get("userId") } },
  });

  if (!revision) {
    c.status(404);
    return c.json(fail("Revision not found", "NOT_FOUND"));
  }

  const post = await c.var.prisma.posts.update({
    where: { id_authorId: { id, authorId: c.get("userId") } },
    data: {
      title: revision.title,
      subTitle: revision.subTitle,
      content: revision.content,
      readingTime: readingTime(revision.content),
    },
    include: postInclude(c.get("userId")),
  });

  return c.json(ok({ post: normalizePost(post) }));
});

Posts.post("/:id/reading-progress", authMiddleware, async (c) => {
  const body = await parseBody<ReadingBody>(c);
  const progress = Math.min(100, Math.max(0, Number(body.progress) || 0));
  const history = await c.var.prisma.readingHistory.upsert({
    where: { userId_postId: { userId: c.get("userId"), postId: c.req.param("id") } },
    update: {
      progress,
      lastReadRevisionId:
        typeof body.lastReadRevisionId === "string" ? body.lastReadRevisionId : null,
      lastReadAt: new Date(),
    },
    create: {
      userId: c.get("userId"),
      postId: c.req.param("id"),
      progress,
      lastReadRevisionId:
        typeof body.lastReadRevisionId === "string" ? body.lastReadRevisionId : null,
    },
  });

  return c.json(ok({ history }));
});

Posts.post("/:id/like", authMiddleware, async (c) => {
  const post = await c.var.prisma.posts.findUnique({
    where: { id: c.req.param("id") },
    select: { id: true, title: true, authorId: true },
  });

  if (!post) {
    c.status(404);
    return c.json(fail("Post not found", "NOT_FOUND"));
  }

  await c.var.prisma.likes.upsert({
    where: { postId_userId: { postId: c.req.param("id"), userId: c.get("userId") } },
    update: {},
    create: { postId: c.req.param("id"), userId: c.get("userId") },
  });

  await notify(c.var.prisma, {
    userId: post.authorId,
    actorId: c.get("userId"),
    postId: post.id,
    type: "LIKE",
    message: `Someone liked ${post.title}.`,
  });

  return c.json(ok({ liked: true }));
});

Posts.delete("/:id/like", authMiddleware, async (c) => {
  await c.var.prisma.likes.deleteMany({
    where: { postId: c.req.param("id"), userId: c.get("userId") },
  });

  return c.json(ok({ liked: false }));
});

Posts.post("/:id/bookmark", authMiddleware, async (c) => {
  const post = await c.var.prisma.posts.findUnique({
    where: { id: c.req.param("id") },
    select: { id: true, title: true, authorId: true },
  });

  if (!post) {
    c.status(404);
    return c.json(fail("Post not found", "NOT_FOUND"));
  }

  await c.var.prisma.bookmarks.upsert({
    where: { postId_userId: { postId: c.req.param("id"), userId: c.get("userId") } },
    update: {},
    create: { postId: c.req.param("id"), userId: c.get("userId") },
  });

  await notify(c.var.prisma, {
    userId: post.authorId,
    actorId: c.get("userId"),
    postId: post.id,
    type: "BOOKMARK",
    message: `Someone saved ${post.title}.`,
  });

  return c.json(ok({ bookmarked: true }));
});

Posts.delete("/:id/bookmark", authMiddleware, async (c) => {
  await c.var.prisma.bookmarks.deleteMany({
    where: { postId: c.req.param("id"), userId: c.get("userId") },
  });

  return c.json(ok({ bookmarked: false }));
});

Posts.get("/:id/comments", async (c) => {
  const comments = await c.var.prisma.comments.findMany({
    where: { postId: c.req.param("id"), parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { userName: true, firstName: true, avatarUrl: true } },
      replies: {
        include: { author: { select: { userName: true, firstName: true, avatarUrl: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return c.json(ok({ comments }));
});

Posts.post("/:id/comments", authMiddleware, async (c) => {
  const body = await parseBody<CommentBody>(c);
  if (typeof body.content !== "string" || !body.content.trim()) {
    c.status(400);
    return c.json(fail("Comment content is required", "VALIDATION"));
  }

  const comment = await c.var.prisma.comments.create({
    data: {
      content: body.content.trim(),
      parentId: typeof body.parentId === "string" ? body.parentId : null,
      postId: c.req.param("id"),
      authorId: c.get("userId"),
    },
    include: { author: { select: { userName: true, firstName: true, avatarUrl: true } } },
  });

  const post = await c.var.prisma.posts.findUnique({
    where: { id: c.req.param("id") },
    select: { id: true, title: true, authorId: true },
  });

  if (post) {
    await notify(c.var.prisma, {
      userId: post.authorId,
      actorId: c.get("userId"),
      postId: post.id,
      type: "COMMENT",
      message: `New comment on ${post.title}.`,
    });
  }

  return c.json(ok({ comment }));
});

Posts.delete("/:id/comments/:commentId", authMiddleware, async (c) => {
  const comment = await c.var.prisma.comments.findFirst({
    where: { id: c.req.param("commentId"), postId: c.req.param("id") },
    include: { post: { select: { authorId: true } } },
  });

  if (!comment || (comment.authorId !== c.get("userId") && comment.post.authorId !== c.get("userId"))) {
    c.status(404);
    return c.json(fail("Comment not found", "NOT_FOUND"));
  }

  await c.var.prisma.comments.deleteMany({ where: { parentId: comment.id } });
  await c.var.prisma.comments.delete({ where: { id: comment.id } });
  return c.json(ok({ deleted: true }));
});

Posts.get("/:id/highlights", authMiddleware, async (c) => {
  const highlights = await c.var.prisma.highlights.findMany({
    where: { postId: c.req.param("id"), userId: c.get("userId") },
    orderBy: { createdAt: "desc" },
  });

  return c.json(ok({ highlights }));
});

Posts.post("/:id/highlights", authMiddleware, async (c) => {
  const body = await parseBody<HighlightBody>(c);
  if (typeof body.selectedText !== "string" || !body.selectedText.trim()) {
    c.status(400);
    return c.json(fail("Selected text is required", "VALIDATION"));
  }

  const highlight = await c.var.prisma.highlights.create({
    data: {
      postId: c.req.param("id"),
      userId: c.get("userId"),
      selectedText: body.selectedText.trim(),
      startOffset: Number(body.startOffset) || 0,
      endOffset: Number(body.endOffset) || 0,
      note: typeof body.note === "string" ? body.note : null,
    },
  });

  return c.json(ok({ highlight }));
});

Posts.delete("/:id/highlights/:highlightId", authMiddleware, async (c) => {
  await c.var.prisma.highlights.deleteMany({
    where: {
      id: c.req.param("highlightId"),
      postId: c.req.param("id"),
      userId: c.get("userId"),
    },
  });

  return c.json(ok({ deleted: true }));
});

Posts.get("/:id/private-note", authMiddleware, async (c) => {
  const note = await c.var.prisma.privateNotes.findUnique({
    where: { userId_postId: { userId: c.get("userId"), postId: c.req.param("id") } },
  });

  return c.json(ok({ note }));
});

Posts.put("/:id/private-note", authMiddleware, async (c) => {
  const body = await parseBody<NoteBody>(c);
  const note = await c.var.prisma.privateNotes.upsert({
    where: { userId_postId: { userId: c.get("userId"), postId: c.req.param("id") } },
    update: { content: typeof body.content === "string" ? body.content : "" },
    create: {
      postId: c.req.param("id"),
      userId: c.get("userId"),
      content: typeof body.content === "string" ? body.content : "",
    },
  });

  return c.json(ok({ note }));
});

Posts.delete("/:id/private-note", authMiddleware, async (c) => {
  await c.var.prisma.privateNotes.deleteMany({
    where: { userId: c.get("userId"), postId: c.req.param("id") },
  });

  return c.json(ok({ deleted: true }));
});

Posts.get("/:id/series-context", async (c) => {
  const links = await c.var.prisma.seriesPosts.findMany({
    where: {
      postId: c.req.param("id"),
      series: { visibility: "PUBLIC" },
    },
    include: {
      series: {
        include: {
          posts: {
            orderBy: { order: "asc" },
            include: {
              post: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  subTitle: true,
                  readingTime: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const contexts = links.map((link) => {
    const index = link.series.posts.findIndex((item) => item.postId === link.postId);
    return {
      series: {
        id: link.series.id,
        title: link.series.title,
        slug: link.series.slug,
      },
      previous: index > 0 ? link.series.posts[index - 1].post : null,
      next: index >= 0 && index < link.series.posts.length - 1 ? link.series.posts[index + 1].post : null,
      progress: {
        current: index + 1,
        total: link.series.posts.length,
      },
    };
  });

  return c.json(ok({ contexts }));
});

Posts.get("/:slug", async (c) => {
  const viewerId = await getOptionalUserId(c);
  const post = await c.var.prisma.posts.findUnique({
    where: { slug: c.req.param("slug") },
    include: postInclude(viewerId),
  });

  if (!post || (post.status !== "PUBLISHED" && post.authorId !== viewerId)) {
    c.status(404);
    return c.json(fail("Post not found", "NOT_FOUND"));
  }

  return c.json(ok({ post: normalizePost(post) }));
});

export default Posts;
