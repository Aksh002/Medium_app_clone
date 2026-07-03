import axios, { AxiosError, AxiosRequestConfig } from "axios";
import type {
  ApiEnvelope,
  Challenge,
  Comment,
  Library,
  Post,
  PostInput,
  Revision,
  Series,
  User,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://backend.akshitgangwar02.workers.dev/api/v1";

export const tokenStore = {
  get: () => localStorage.getItem("jwtToken") ?? "",
  set: (token: string) => localStorage.setItem("jwtToken", token),
  clear: () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("firstName");
    localStorage.removeItem("email");
  },
};

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrap = async <T>(request: Promise<{ data: ApiEnvelope<T> | T }>) => {
  try {
    const response = await request;
    const body = response.data;
    if (typeof body === "object" && body !== null && "ok" in body) {
      const envelope = body as ApiEnvelope<T>;
      if (!envelope.ok || envelope.data === null) {
        throw new Error(envelope.error?.message ?? "Request failed");
      }
      return envelope.data;
    }

    return body as T;
  } catch (error) {
    const axiosError = error as AxiosError<{ msg?: string; error?: { message?: string } }>;
    const message =
      axiosError.response?.data?.error?.message ??
      axiosError.response?.data?.msg ??
      (error instanceof Error ? error.message : "Request failed");
    throw new Error(message);
  }
};

const legacy = async <T>(config: AxiosRequestConfig) => {
  const response = await client.request<T>(config);
  return response.data;
};

export const api = {
  async signup(input: { email: string; password: string; userName: string; firstName: string }) {
    const data = await legacy<{ token?: string; msg?: string }>({
      url: "/user/signup",
      method: "POST",
      data: input,
    });
    if (!data.token) {
      throw new Error(data.msg ?? "Signup failed");
    }
    tokenStore.set(data.token);
    return data.token;
  },

  async signin(input: { email: string; password: string }) {
    const data = await legacy<{ token?: string; msg?: string }>({
      url: "/user/signin",
      method: "POST",
      data: input,
    });
    if (!data.token) {
      throw new Error(data.msg ?? "Signin failed");
    }
    tokenStore.set(data.token);
    return data.token;
  },

  async me() {
    const data = await legacy<{ user: User; msg?: string }>({ url: "/user/me", method: "GET" });
    if (data.user) {
      localStorage.setItem("userName", data.user.userName);
      localStorage.setItem("firstName", data.user.firstName);
      if (data.user.email) {
        localStorage.setItem("email", data.user.email);
      }
    }
    return data.user;
  },

  posts: () => unwrap<{ posts: Post[] }>(client.get("/posts")),
  myPosts: () => unwrap<{ posts: Post[] }>(client.get("/posts/mine")),
  drafts: () => unwrap<{ posts: Post[] }>(client.get("/posts/drafts")),
  postBySlug: (slug: string) => unwrap<{ post: Post }>(client.get(`/posts/${slug}`)),
  createPost: (input: PostInput) => unwrap<{ post: Post }>(client.post("/posts", input)),
  updatePost: (id: string, input: Partial<PostInput>) =>
    unwrap<{ post: Post }>(client.put(`/posts/${id}`, input)),
  publishPost: (id: string) => unwrap<{ post: Post }>(client.post(`/posts/${id}/publish`)),
  likePost: (id: string) => unwrap<{ liked: boolean }>(client.post(`/posts/${id}/like`)),
  unlikePost: (id: string) => unwrap<{ liked: boolean }>(client.delete(`/posts/${id}/like`)),
  bookmarkPost: (id: string) => unwrap<{ bookmarked: boolean }>(client.post(`/posts/${id}/bookmark`)),
  unbookmarkPost: (id: string) => unwrap<{ bookmarked: boolean }>(client.delete(`/posts/${id}/bookmark`)),
  comments: (id: string) => unwrap<{ comments: Comment[] }>(client.get(`/posts/${id}/comments`)),
  addComment: (id: string, content: string) =>
    unwrap<{ comment: Comment }>(client.post(`/posts/${id}/comments`, { content })),
  revisions: (id: string) => unwrap<{ revisions: Revision[] }>(client.get(`/posts/${id}/revisions`)),
  readingProgress: (id: string, progress: number) =>
    unwrap<{ history: unknown }>(client.post(`/posts/${id}/reading-progress`, { progress })),
  highlights: (id: string) => unwrap<{ highlights: unknown[] }>(client.get(`/posts/${id}/highlights`)),
  addHighlight: (id: string, selectedText: string) =>
    unwrap<{ highlight: unknown }>(
      client.post(`/posts/${id}/highlights`, {
        selectedText,
        startOffset: 0,
        endOffset: selectedText.length,
      }),
    ),
  privateNote: (id: string) => unwrap<{ note: unknown }>(client.get(`/posts/${id}/private-note`)),
  savePrivateNote: (id: string, content: string) =>
    unwrap<{ note: unknown }>(client.put(`/posts/${id}/private-note`, { content })),
  profile: (userName: string) =>
    unwrap<{ user: User & { posts: Post[]; followedByViewer: boolean } }>(
      client.get(`/users/${userName}`),
    ),
  follow: (userName: string) => unwrap<{ following: boolean }>(client.post(`/users/${userName}/follow`)),
  unfollow: (userName: string) => unwrap<{ following: boolean }>(client.delete(`/users/${userName}/follow`)),
  series: () => unwrap<{ series: Series[] }>(client.get("/series")),
  seriesBySlug: (slug: string) => unwrap<{ series: Series }>(client.get(`/series/${slug}`)),
  createSeries: (input: { title: string; description?: string }) =>
    unwrap<{ series: Series }>(client.post("/series", input)),
  library: () => unwrap<Library>(client.get("/library")),
  challenges: () => unwrap<{ challenges: Challenge[] }>(client.get("/challenges")),
  challenge: (slug: string) => unwrap<{ challenge: Challenge }>(client.get(`/challenges/${slug}`)),
  search: (query: string) => unwrap<{ posts: Post[]; users: User[]; tags: unknown[] }>(client.get(`/search?q=${encodeURIComponent(query)}`)),
};
