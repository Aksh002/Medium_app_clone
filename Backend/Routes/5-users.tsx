import { Hono } from "hono";
import { authMiddleware, fail, getOptionalUserId, ok, parseBody, prismaMiddleware } from "./utils";

const UsersRoute = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
  Variables: { userId: string; prisma: import("@prisma/client/edge").PrismaClient };
}>();

type ProfileBody = {
  firstName: string;
  bio: string;
  avatarUrl: string;
};

UsersRoute.use("*", prismaMiddleware);

UsersRoute.get("/:userName", async (c) => {
  const viewerId = await getOptionalUserId(c);
  const user = await c.var.prisma.users.findUnique({
    where: { userName: c.req.param("userName") },
    select: {
      id: true,
      userName: true,
      firstName: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      posts: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          subTitle: true,
          slug: true,
          readingTime: true,
          publishedAt: true,
          tags: { include: { tag: true } },
          _count: { select: { likes: true, comments: true, bookmarks: true } },
        },
      },
      followers: viewerId ? { where: { followerId: viewerId }, select: { id: true } } : false,
      _count: { select: { followers: true, following: true, posts: true } },
    },
  });

  if (!user) {
    c.status(404);
    return c.json(fail("User not found", "NOT_FOUND"));
  }

  const normalized = {
    ...user,
    followedByViewer: Boolean(user.followers && user.followers.length),
    followers: undefined,
    posts: user.posts.map((post) => ({
      ...post,
      tags: post.tags.map((item) => item.tag),
    })),
  };

  return c.json(ok({ user: normalized }));
});

UsersRoute.put("/me/profile", authMiddleware, async (c) => {
  const body = await parseBody<ProfileBody>(c);
  const user = await c.var.prisma.users.update({
    where: { id: c.get("userId") },
    data: {
      firstName: typeof body.firstName === "string" && body.firstName.trim() ? body.firstName.trim() : undefined,
      bio: typeof body.bio === "string" ? body.bio : undefined,
      avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl || null : undefined,
    },
    select: {
      id: true,
      email: true,
      userName: true,
      firstName: true,
      bio: true,
      avatarUrl: true,
    },
  });

  return c.json(ok({ user }));
});

UsersRoute.post("/:userName/follow", authMiddleware, async (c) => {
  const target = await c.var.prisma.users.findUnique({
    where: { userName: c.req.param("userName") },
    select: { id: true },
  });

  if (!target || target.id === c.get("userId")) {
    c.status(400);
    return c.json(fail("Cannot follow this user", "VALIDATION"));
  }

  await c.var.prisma.follows.upsert({
    where: { followerId_followingId: { followerId: c.get("userId"), followingId: target.id } },
    update: {},
    create: { followerId: c.get("userId"), followingId: target.id },
  });

  return c.json(ok({ following: true }));
});

UsersRoute.delete("/:userName/follow", authMiddleware, async (c) => {
  const target = await c.var.prisma.users.findUnique({
    where: { userName: c.req.param("userName") },
    select: { id: true },
  });

  if (target) {
    await c.var.prisma.follows.deleteMany({
      where: { followerId: c.get("userId"), followingId: target.id },
    });
  }

  return c.json(ok({ following: false }));
});

export default UsersRoute;
