import { atom } from "recoil";

export const publishAtom = atom({
  key: "publishAtom",
  default: {
    title: "",
    subTitle: "",
    content: "",
    coverImageUrl: "",
    tags: [] as string[],
  },
});
