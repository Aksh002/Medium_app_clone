import { useAuthGuard } from "../hooks";

export const useAuthCheck = () => {
  useAuthGuard();
};
