"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const getugcomments = async (
  comment: any[any],
  page: number,
  isView?: boolean
) => {
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
    .from("ug_comments")
    .select("*, users(*)")
    .order("created_at", { ascending: false })
    .eq("comment", comment)
    .range(page === 1 ? 0 : page * min, page === 1 ? max : page * min + max);
  if (error) return { error: error };

  return { success: data };
};
