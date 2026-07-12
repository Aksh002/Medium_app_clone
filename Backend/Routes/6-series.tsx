import { Hono } from "hono";
import { authMiddleware, fail, ok, parseBody, prismaMiddleware, slugify } from "./utils";

const SeriesRoute = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
  Variables: { userId: string; prisma: import("@prisma/client/edge").PrismaClient };
}>();

type SeriesBody = {
  title: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
};

type SeriesPostBody = {
  postId: string;
  order: number;
};

type SeriesReorderBody = {
  postIds: string[];
};

SeriesRoute.use("*", prismaMiddleware);

const uniqueSeriesSlug = async (
  prisma: import("@prisma/client/edge").PrismaClient,
  title: string,
  currentSeriesId?: string,
) => {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.series.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === currentSeriesId) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
};

SeriesRoute.get("/", async (c) => {
  const series = await c.var.prisma.series.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { updatedAt: "desc" },
    include: {
      author: { select: { userName: true, firstName: true, avatarUrl: true } },
      _count: { select: { posts: true } },
    },
  });

  return c.json(ok({ series }));
});

SeriesRoute.get("/mine", authMiddleware, async (c) => {
  const series = await c.var.prisma.series.findMany({
    where: { authorId: c.get("userId") },
    orderBy: { updatedAt: "desc" },
    include: {
      posts: {
        orderBy: { order: "asc" },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
              readingTime: true,
            },
          },
        },
      },
      _count: { select: { posts: true } },
    },
  });

  return c.json(ok({ series }));
});

SeriesRoute.post("/", authMiddleware, async (c) => {
  const body = await parseBody<SeriesBody>(c);
  if (typeof body.title !== "string" || !body.title.trim()) {
    c.status(400);
    return c.json(fail("Series title is required", "VALIDATION"));
  }

  const series = await c.var.prisma.series.create({
    data: {
      title: body.title.trim(),
      description: typeof body.description === "string" ? body.description : "",
      slug: await uniqueSeriesSlug(c.var.prisma, body.title),
      visibility: body.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC",
      authorId: c.get("userId"),
    },
  });

  return c.json(ok({ series }));
});

SeriesRoute.put("/:id", authMiddleware, async (c) => {
  const body = await parseBody<SeriesBody>(c);
  const existing = await c.var.prisma.series.findFirst({
    where: { id: c.req.param("id"), authorId: c.get("userId") },
  });

  if (!existing) {
    c.status(404);
    return c.json(fail("Series not found", "NOT_FOUND"));
  }

  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : existing.title;
  const series = await c.var.prisma.series.update({
    where: { id: existing.id },
    data: {
      title,
      slug: title !== existing.title ? await uniqueSeriesSlug(c.var.prisma, title, existing.id) : existing.slug,
      description: typeof body.description === "string" ? body.description : existing.description,
      visibility: body.visibility === "PRIVATE" ? "PRIVATE" : body.visibility === "PUBLIC" ? "PUBLIC" : existing.visibility,
    },
  });

  return c.json(ok({ series }));
});

SeriesRoute.post("/:id/posts", authMiddleware, async (c) => {
  const body = await parseBody<SeriesPostBody>(c);
  const series = await c.var.prisma.series.findFirst({
    where: { id: c.req.param("id"), authorId: c.get("userId") },
    select: { id: true },
  });

  if (!series || typeof body.postId !== "string") {
    c.status(404);
    return c.json(fail("Series or post not found", "NOT_FOUND"));
  }

  const post = await c.var.prisma.posts.findFirst({
    where: { id: body.postId, authorId: c.get("userId") },
    select: { id: true },
  });

  if (!post) {
    c.status(404);
    return c.json(fail("Post not found", "NOT_FOUND"));
  }

  await c.var.prisma.seriesPosts.upsert({
    where: { seriesId_postId: { seriesId: series.id, postId: post.id } },
    update: { order: Number(body.order) || 1 },
    create: { seriesId: series.id, postId: post.id, order: Number(body.order) || 1 },
  });

  return c.json(ok({ added: true }));
});

SeriesRoute.put("/:id/posts/reorder", authMiddleware, async (c) => {
  const body = await parseBody<SeriesReorderBody>(c);
  const postIds = Array.isArray(body.postIds)
    ? body.postIds.filter((item): item is string => typeof item === "string")
    : [];

  const series = await c.var.prisma.series.findFirst({
    where: { id: c.req.param("id"), authorId: c.get("userId") },
    include: { posts: { select: { postId: true } } },
  });

  if (!series) {
    c.status(404);
    return c.json(fail("Series not found", "NOT_FOUND"));
  }

  const current = new Set(series.posts.map((item) => item.postId));
  const orderedIds = postIds.filter((postId) => current.has(postId));
  const missingIds = series.posts.map((item) => item.postId).filter((postId) => !orderedIds.includes(postId));
  const finalOrder = [...orderedIds, ...missingIds];

  await c.var.prisma.seriesPosts.deleteMany({ where: { seriesId: series.id } });
  for (const [index, postId] of finalOrder.entries()) {
    await c.var.prisma.seriesPosts.create({
      data: {
        seriesId: series.id,
        postId,
        order: index + 1,
      },
    });
  }

  return c.json(ok({ reordered: true }));
});

SeriesRoute.delete("/:id/posts/:postId", authMiddleware, async (c) => {
  const series = await c.var.prisma.series.findFirst({
    where: { id: c.req.param("id"), authorId: c.get("userId") },
    select: { id: true },
  });

  if (series) {
    await c.var.prisma.seriesPosts.deleteMany({
      where: { seriesId: series.id, postId: c.req.param("postId") },
    });
  }

  return c.json(ok({ removed: true }));
});

SeriesRoute.get("/:slug", async (c) => {
  const series = await c.var.prisma.series.findUnique({
    where: { slug: c.req.param("slug") },
    include: {
      author: { select: { userName: true, firstName: true, avatarUrl: true } },
      posts: {
        orderBy: { order: "asc" },
        include: {
          post: {
            include: {
              author: { select: { userName: true, firstName: true, avatarUrl: true } },
              tags: { include: { tag: true } },
            },
          },
        },
      },
    },
  });

  if (!series || series.visibility !== "PUBLIC") {
    c.status(404);
    return c.json(fail("Series not found", "NOT_FOUND"));
  }

  return c.json(ok({ series }));
});

export default SeriesRoute;
