"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const getcomments = async (post?: any[any]) => {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("comments")
    .select("*, users(*), posts(*))")
    .order("created_at", { ascending: false })
    .eq("post", post.id);
  // .range(page === 1 ? 0 : page * 10, page === 1 ? 9 : page * 10 + 9);

  if (error) return { error: error };

  return { success: data };
};
