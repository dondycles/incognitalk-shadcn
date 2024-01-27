import { create } from "zustand";
import { persist } from "zustand/middleware";
type OptimisticPost = {
  content: any[any] | null | undefined;
  setContent: (content: any[any] | null | undefined) => void;
};

export const useOptimisticPost = create<OptimisticPost>()(
  persist(
    (set) => ({
      content: null,
      setContent: (content) => set((state) => ({ content: content })),
    }),
    { name: "opt" }
  )
);
type UserData = {
  username: string | null;
  setUserName: (username: string | null) => void;
};

export const useUserData = create<UserData>()((set) => ({
  username: null,
  setUserName: (username) => set((state) => ({ username: username })),
}));
