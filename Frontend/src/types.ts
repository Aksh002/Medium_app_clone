export type ApiEnvelope<T> = {
  ok: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
};

export type User = {
  id: string;
  email?: string;
  userName: string;
  firstName: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type Tag = {
  name: string;
  slug: string;
};

export type Post = {
  id: string;
  title: string;
  subTitle: string;
  content: string;
  slug: string;
  coverImageUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  published: boolean;
  readingTime: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  authorId: string;
  author?: User;
  tags?: Tag[];
  likedByViewer?: boolean;
  bookmarkedByViewer?: boolean;
  _count?: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: Pick<User, "userName" | "firstName" | "avatarUrl">;
  replies?: Comment[];
};

export type Revision = {
  id: string;
  version: number;
  title: string;
  subTitle: string;
  content: string;
  changeNote?: string | null;
  createdAt: string;
};

export type Series = {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  visibility: "PUBLIC" | "PRIVATE";
  author?: Pick<User, "userName" | "firstName" | "avatarUrl">;
  posts?: { post: Post; order: number }[];
  _count?: { posts: number };
};

export type Challenge = {
  id: string;
  title: string;
  slug: string;
  description: string;
  durationDays: number;
  promptTemplate: string;
  entries?: unknown[];
  _count?: { entries: number };
};

export type Library = {
  bookmarks: unknown[];
  highlights: unknown[];
  notes: unknown[];
  history: unknown[];
};

export type PostInput = {
  title: string;
  subTitle?: string;
  content?: string;
  coverImageUrl?: string;
  tags?: string[];
  changeNote?: string;
};
