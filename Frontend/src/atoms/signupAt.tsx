import { atom } from "recoil";

export type SignupDraft = {
  email: string;
  userName: string;
  firstName: string;
};

export const signupAtom = atom<SignupDraft>({
  key: "signupAtom",
  default: {
    email: "",
    userName: "",
    firstName: "",
  },
});
