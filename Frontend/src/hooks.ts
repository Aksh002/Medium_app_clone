import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, tokenStore } from "./lib/api";
import type { Post, User } from "./types";

type AsyncState<T> = {
  data: T;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
};

export const useAsyncData = <T,>(fallback: T, loader: () => Promise<T>): AsyncState<T> => {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await loader());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
};

export const useAuthGuard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!tokenStore.get()) {
        navigate("/");
        return;
      }

      try {
        setUser(await api.me());
      } catch {
        tokenStore.clear();
        navigate("/");
      } finally {
        setChecking(false);
      }
    };

    void check();
  }, [navigate]);

  return { user, checking };
};

export const usePublicRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokenStore.get()) {
      return;
    }

    const check = async () => {
      try {
        await api.me();
        navigate("/blogs");
      } catch {
        tokenStore.clear();
      }
    };

    void check();
  }, [navigate]);
};

export const usePosts = () =>
  useAsyncData<Post[]>([], async () => {
    const response = await api.posts();
    return response.posts;
  });

export const useMyPosts = () =>
  useAsyncData<Post[]>([], async () => {
    const response = await api.myPosts();
    return response.posts;
  });

export const useDrafts = () =>
  useAsyncData<Post[]>([], async () => {
    const response = await api.drafts();
    return response.posts;
  });
