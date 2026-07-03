import { atom } from "recoil";
import type { Post } from "../types";

export const viewMyBlogsAtom = atom<boolean>({
  key: "viewMyBlogsAtom",
  default: false,
});

export const myBlogsAtom = atom<Post[]>({
  key: "myBlogsAtom",
  default: [],
});
