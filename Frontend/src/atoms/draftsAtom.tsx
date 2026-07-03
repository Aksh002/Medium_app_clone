import { atom } from "recoil";
import type { Post } from "../types";

export const viewDraftAtom = atom<boolean>({
  key: "viewDraft",
  default: false,
});

export const draftsAtom = atom<Post[]>({
  key: "draftsAtom",
  default: [],
});
