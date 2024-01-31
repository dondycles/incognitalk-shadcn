"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const getcomments = async (
  post: any[any],
  page: number,
  isView?: boolean
) => {
  console.log(isView);
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

  const max = isView ? 4 : 1;
  const min = isView ? 5 : 2;

  const { data, error } = await supabase
    .from("comments")
    .select("*, users(*), posts(*), comments(*))")
    .order("created_at", { ascending: false })
    .eq("post", post)
    .range(page === 1 ? 0 : page * min, page === 1 ? max : page * min + max);
  if (error) return { error: error };

  return { success: data };
};
