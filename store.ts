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
