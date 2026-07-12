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
  authorId?: string;
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
  entries?: ChallengeEntry[];
  _count?: { entries: number };
};

export type Highlight = {
  id: string;
  selectedText: string;
  note?: string | null;
  createdAt: string;
  post?: Pick<Post, "title" | "slug">;
};

export type PrivateNote = {
  id: string;
  content: string;
  updatedAt: string;
  post?: Pick<Post, "title" | "slug">;
};

export type ReadingHistoryItem = {
  id: string;
  progress: number;
  lastReadAt: string;
  post: Pick<Post, "title" | "slug" | "readingTime">;
};

export type Library = {
  bookmarks: { id: string; post: Post; createdAt: string }[];
  highlights: Highlight[];
  notes: PrivateNote[];
  history: ReadingHistoryItem[];
};

export type Notification = {
  id: string;
  type: "LIKE" | "BOOKMARK" | "COMMENT" | "FOLLOW" | "REVISION";
  message: string;
  read: boolean;
  createdAt: string;
  postId?: string | null;
};

export type WriterAnalytics = {
  summary: {
    posts: number;
    published: number;
    drafts: number;
    reads: number;
    completionRate: number;
    saves: number;
    comments: number;
  };
  mostReadPosts: {
    id: string;
    title: string;
    slug: string;
    reads: number;
    likes: number;
    bookmarks: number;
    comments: number;
  }[];
  updateCandidates: {
    id: string;
    title: string;
    slug: string;
    updatedAt: string;
    reads: number;
  }[];
};

export type AiSuggestion = {
  id: string;
  kind: string;
  output: string;
  accepted: boolean;
  createdAt: string;
};

export type SeriesContext = {
  series: Pick<Series, "id" | "title" | "slug">;
  previous: Pick<Post, "id" | "title" | "slug" | "subTitle" | "readingTime"> | null;
  next: Pick<Post, "id" | "title" | "slug" | "subTitle" | "readingTime"> | null;
  progress: {
    current: number;
    total: number;
  };
};

export type ChallengeEntry = {
  id: string;
  dayNumber: number;
  createdAt: string;
  post?: Pick<Post, "title" | "slug"> | null;
};

export type PostInput = {
  title: string;
  subTitle?: string;
  content?: string;
  coverImageUrl?: string;
  tags?: string[];
  changeNote?: string;
};
