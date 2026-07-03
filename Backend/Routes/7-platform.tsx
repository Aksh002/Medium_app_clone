import { Hono } from "hono";
import { authMiddleware, fail, ok, parseBody, prismaMiddleware, slugify } from "./utils";

const Platform = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
  Variables: { userId: string; prisma: import("@prisma/client/edge").PrismaClient };
}>();

type ReportBody = {
  postId: string;
  commentId: string;
  reason: string;
};

type ChallengeEntryBody = {
  postId: string;
  dayNumber: number;
};

Platform.use("*", prismaMiddleware);

Platform.get("/search", async (c) => {
  const query = c.req.query("q")?.trim() ?? "";
  if (!query) {
    return c.json(ok({ posts: [], users: [], tags: [] }));
  }

  const [posts, users, tags] = await Promise.all([
    c.var.prisma.posts.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { subTitle: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { tags: { some: { tag: { name: { contains: query, mode: "insensitive" } } } } },
        ],
      },
      take: 20,
      orderBy: { publishedAt: "desc" },
      include: {
        author: { select: { userName: true, firstName: true, avatarUrl: true } },
        tags: { include: { tag: true } },
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
    }),
    c.var.prisma.users.findMany({
      where: {
        OR: [
          { userName: { contains: query, mode: "insensitive" } },
          { firstName: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: { userName: true, firstName: true, bio: true, avatarUrl: true },
    }),
    c.var.prisma.tags.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 10,
    }),
  ]);

  return c.json(ok({ posts, users, tags }));
});

Platform.get("/feed/trending", async (c) => {
  const posts = await c.var.prisma.posts.findMany({
    where: { status: "PUBLISHED" },
    take: 30,
    orderBy: [{ likes: { _count: "desc" } }, { publishedAt: "desc" }],
    include: {
      author: { select: { userName: true, firstName: true, avatarUrl: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true, bookmarks: true } },
    },
  });

  return c.json(ok({ posts }));
});

Platform.get("/feed/following", authMiddleware, async (c) => {
  const follows = await c.var.prisma.follows.findMany({
    where: { followerId: c.get("userId") },
    select: { followingId: true },
  });

  const posts = await c.var.prisma.posts.findMany({
    where: {
      status: "PUBLISHED",
      authorId: { in: follows.map((follow) => follow.followingId) },
    },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { userName: true, firstName: true, avatarUrl: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true, bookmarks: true } },
    },
  });

  return c.json(ok({ posts }));
});

Platform.get("/library", authMiddleware, async (c) => {
  const [bookmarks, highlights, notes, history] = await Promise.all([
    c.var.prisma.bookmarks.findMany({
      where: { userId: c.get("userId") },
      orderBy: { createdAt: "desc" },
      include: { post: { include: { author: { select: { userName: true, firstName: true } } } } },
    }),
    c.var.prisma.highlights.findMany({
      where: { userId: c.get("userId") },
      orderBy: { createdAt: "desc" },
      include: { post: { select: { title: true, slug: true } } },
    }),
    c.var.prisma.privateNotes.findMany({
      where: { userId: c.get("userId") },
      orderBy: { updatedAt: "desc" },
      include: { post: { select: { title: true, slug: true } } },
    }),
    c.var.prisma.readingHistory.findMany({
      where: { userId: c.get("userId") },
      orderBy: { lastReadAt: "desc" },
      include: { post: { select: { title: true, slug: true, readingTime: true } } },
    }),
  ]);

  return c.json(ok({ bookmarks, highlights, notes, history }));
});

Platform.get("/library/export", authMiddleware, async (c) => {
  const [highlights, notes] = await Promise.all([
    c.var.prisma.highlights.findMany({
      where: { userId: c.get("userId") },
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    }),
    c.var.prisma.privateNotes.findMany({
      where: { userId: c.get("userId") },
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const markdown = [
    "# My learning library",
    "",
    "## Highlights",
    ...highlights.map((item) => `- [${item.post.title}](/p/${item.post.slug}): "${item.selectedText}"${item.note ? ` - ${item.note}` : ""}`),
    "",
    "## Private notes",
    ...notes.map((item) => `### ${item.post.title}\n\n${item.content}\n`),
  ].join("\n");

  return c.text(markdown, 200, {
    "Content-Type": "text/markdown; charset=utf-8",
  });
});

Platform.get("/notifications", authMiddleware, async (c) => {
  const notifications = await c.var.prisma.notifications.findMany({
    where: { userId: c.get("userId") },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return c.json(ok({ notifications }));
});

Platform.post("/reports", authMiddleware, async (c) => {
  const body = await parseBody<ReportBody>(c);
  if (typeof body.reason !== "string" || body.reason.trim().length < 3) {
    c.status(400);
    return c.json(fail("Report reason is required", "VALIDATION"));
  }

  const report = await c.var.prisma.reports.create({
    data: {
      userId: c.get("userId"),
      postId: typeof body.postId === "string" ? body.postId : null,
      commentId: typeof body.commentId === "string" ? body.commentId : null,
      reason: body.reason.trim(),
    },
  });

  return c.json(ok({ report }));
});

Platform.get("/challenges", async (c) => {
  const challenges = await c.var.prisma.challenges.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { entries: true } } },
  });

  if (challenges.length) {
    return c.json(ok({ challenges }));
  }

  return c.json(
    ok({
      challenges: [
        {
          id: "seed-7-days",
          title: "Write 7 days in public",
          slug: "write-7-days-in-public",
          description: "Publish one learning note every day for a week.",
          durationDays: 7,
          promptTemplate: "Today I learned...",
          createdAt: new Date().toISOString(),
          _count: { entries: 0 },
        },
      ],
    }),
  );
});

Platform.get("/challenges/:slug", async (c) => {
  const challenge = await c.var.prisma.challenges.findUnique({
    where: { slug: c.req.param("slug") },
    include: {
      entries: {
        orderBy: { dayNumber: "asc" },
        include: {
          user: { select: { userName: true, firstName: true, avatarUrl: true } },
          post: { select: { title: true, slug: true } },
        },
      },
    },
  });

  if (!challenge && c.req.param("slug") === "write-7-days-in-public") {
    return c.json(
      ok({
        challenge: {
          id: "seed-7-days",
          title: "Write 7 days in public",
          slug: "write-7-days-in-public",
          description: "Publish one learning note every day for a week.",
          durationDays: 7,
          promptTemplate: "Today I learned...",
          entries: [],
        },
      }),
    );
  }

  if (!challenge) {
    c.status(404);
    return c.json(fail("Challenge not found", "NOT_FOUND"));
  }

  return c.json(ok({ challenge }));
});

Platform.post("/challenges/:slug/entries", authMiddleware, async (c) => {
  const body = await parseBody<ChallengeEntryBody>(c);
  let challenge = await c.var.prisma.challenges.findUnique({
    where: { slug: c.req.param("slug") },
  });

  if (!challenge && c.req.param("slug") === "write-7-days-in-public") {
    challenge = await c.var.prisma.challenges.create({
      data: {
        title: "Write 7 days in public",
        slug: "write-7-days-in-public",
        description: "Publish one learning note every day for a week.",
        durationDays: 7,
        promptTemplate: "Today I learned...",
      },
    });
  }

  if (!challenge) {
    c.status(404);
    return c.json(fail("Challenge not found", "NOT_FOUND"));
  }

  const entry = await c.var.prisma.challengeEntries.upsert({
    where: {
      challengeId_userId_dayNumber: {
        challengeId: challenge.id,
        userId: c.get("userId"),
        dayNumber: Number(body.dayNumber) || 1,
      },
    },
    update: { postId: typeof body.postId === "string" ? body.postId : null },
    create: {
      challengeId: challenge.id,
      userId: c.get("userId"),
      postId: typeof body.postId === "string" ? body.postId : null,
      dayNumber: Number(body.dayNumber) || 1,
    },
  });

  return c.json(ok({ entry }));
});

Platform.get("/tag/:tag", async (c) => {
  const tag = await c.var.prisma.tags.findUnique({
    where: { slug: slugify(c.req.param("tag")) },
    include: {
      posts: {
        include: {
          post: {
            include: {
              author: { select: { userName: true, firstName: true, avatarUrl: true } },
              tags: { include: { tag: true } },
              _count: { select: { likes: true, comments: true, bookmarks: true } },
            },
          },
        },
      },
    },
  });

  if (!tag) {
    c.status(404);
    return c.json(fail("Tag not found", "NOT_FOUND"));
  }

  return c.json(ok({ tag }));
});

export default Platform;
