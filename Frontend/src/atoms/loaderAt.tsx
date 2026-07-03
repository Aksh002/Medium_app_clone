import { atom } from "recoil";

export const loaderAtom = atom<boolean>({
  key: "loaderAtom",
  default: false,
});
