import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

type EnvContext = Context<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
  Variables: { userId: string; prisma: PrismaClient };
}>;

type JwtPayload = {
  id?: unknown;
  email?: unknown;
};

export const ok = <T>(data: T) => ({ ok: true, data, error: null });

export const fail = (message: string, code = "BAD_REQUEST") => ({
  ok: false,
  data: null,
  error: { code, message },
});

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";

export const readingTime = (content: string) =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 220));

export const prismaMiddleware = async (c: EnvContext, next: Next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  c.set("prisma", prisma as unknown as PrismaClient);
  await next();
};

export const getBearerToken = (c: EnvContext) => {
  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.split(" ")[1] || null;
};

export const getOptionalUserId = async (c: EnvContext) => {
  const token = getBearerToken(c);
  if (!token) {
    return null;
  }

  try {
    const payload = (await verify(token, c.env.JWT_SECRET)) as JwtPayload;
    return typeof payload.id === "string" ? payload.id : null;
  } catch {
    return null;
  }
};

export const authMiddleware = async (c: EnvContext, next: Next) => {
  const userId = await getOptionalUserId(c);
  if (!userId) {
    c.status(401);
    return c.json(fail("Authentication is required", "UNAUTHORIZED"));
  }

  c.set("userId", userId);
  await next();
};

export const uniqueSlug = async (
  prisma: PrismaClient,
  title: string,
  currentPostId?: string,
) => {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.posts.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === currentPostId) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
};

export const postInclude = (viewerId: string | null) => ({
  author: {
    select: {
      id: true,
      userName: true,
      firstName: true,
      bio: true,
      avatarUrl: true,
    },
  },
  tags: { include: { tag: true } },
  _count: {
    select: {
      comments: true,
      likes: true,
      bookmarks: true,
    },
  },
  likes: viewerId
    ? {
        where: { userId: viewerId },
        select: { id: true },
      }
    : false,
  bookmarks: viewerId
    ? {
        where: { userId: viewerId },
        select: { id: true },
      }
    : false,
});

export const normalizePost = (post: unknown) => {
  const typed = post as {
    likes?: unknown[];
    bookmarks?: unknown[];
    tags?: { tag: { name: string; slug: string } }[];
    [key: string]: unknown;
  };

  return {
    ...typed,
    tags: typed.tags?.map((item) => item.tag) ?? [],
    likedByViewer: Boolean(typed.likes?.length),
    bookmarkedByViewer: Boolean(typed.bookmarks?.length),
    likes: undefined,
    bookmarks: undefined,
  };
};

export const syncTags = async (
  prisma: PrismaClient,
  postId: string,
  tags: string[] | undefined,
) => {
  if (!tags) {
    return;
  }

  await prisma.postTags.deleteMany({ where: { postId } });

  const uniqueTags = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 8);
  for (const name of uniqueTags) {
    const slug = slugify(name);
    const tag = await prisma.tags.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });

    await prisma.postTags.create({
      data: { postId, tagId: tag.id },
    });
  }
};

export const parseStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export const parseBody = async <T extends Record<string, unknown>>(c: EnvContext) => {
  try {
    return (await c.req.json()) as Partial<T>;
  } catch {
    return {} as Partial<T>;
  }
};
