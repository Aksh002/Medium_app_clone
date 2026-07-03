import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional();

export const userSchema = z.object({
  email: z.string().email(),
  userName: z.string().trim().min(3).max(32),
  firstName: z.string().trim().min(1).max(60).optional(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const profileSchema = z.object({
  firstName: optionalText(60),
  bio: optionalText(280),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const blogSchema = z.object({
  title: optionalText(120),
  subTitle: optionalText(180),
  content: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(32)).max(8).optional(),
});

export const blogUPDschema = blogSchema.extend({
  changeNote: optionalText(220),
});

export const postSchema = z.object({
  title: z.string().trim().min(1).max(120),
  subTitle: z.string().trim().max(180).optional(),
  content: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(32)).max(8).optional(),
});

export const postUpdateSchema = postSchema.partial().extend({
  changeNote: optionalText(220),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1).max(1200),
  parentId: z.string().optional(),
});

export const readingProgressSchema = z.object({
  progress: z.number().int().min(0).max(100),
  lastReadRevisionId: z.string().optional(),
});

export const highlightSchema = z.object({
  selectedText: z.string().trim().min(1).max(2000),
  startOffset: z.number().int().min(0),
  endOffset: z.number().int().min(0),
  note: optionalText(500),
});

export const privateNoteSchema = z.object({
  content: z.string().trim().max(5000),
});

export const seriesSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: optionalText(500),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export const seriesPostSchema = z.object({
  postId: z.string().min(1),
  order: z.number().int().min(1),
});

export const reportSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
  reason: z.string().trim().min(3).max(500),
});

export type userSchema = z.infer<typeof userSchema>;
export type loginSchema = z.infer<typeof loginSchema>;
export type profileSchema = z.infer<typeof profileSchema>;
export type blogSchema = z.infer<typeof blogSchema>;
export type blogUPDschema = z.infer<typeof blogUPDschema>;
export type postSchema = z.infer<typeof postSchema>;
export type postUpdateSchema = z.infer<typeof postUpdateSchema>;
export type commentSchema = z.infer<typeof commentSchema>;
export type readingProgressSchema = z.infer<typeof readingProgressSchema>;
export type highlightSchema = z.infer<typeof highlightSchema>;
export type privateNoteSchema = z.infer<typeof privateNoteSchema>;
export type seriesSchema = z.infer<typeof seriesSchema>;
export type seriesPostSchema = z.infer<typeof seriesPostSchema>;
export type reportSchema = z.infer<typeof reportSchema>;
