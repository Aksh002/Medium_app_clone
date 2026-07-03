import { api } from "../lib/api";

type PublishInput = {
  title: string;
  subTitle?: string;
  content: string;
  postId?: string;
};

export const publishPost = async ({ title, subTitle, content, postId }: PublishInput) => {
  const saved = postId
    ? await api.updatePost(postId, { title, subTitle, content })
    : await api.createPost({ title, subTitle, content });

  return api.publishPost(saved.post.id);
};
