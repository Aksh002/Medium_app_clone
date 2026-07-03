import { atom } from "recoil";
import type { Post } from "../types";

export const blogsAtom = atom<Post[]>({
  key: "blogsAtom",
  default: [],
});
