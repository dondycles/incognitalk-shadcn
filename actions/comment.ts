"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const comment = async (values?: any, type?: string) => {
  const cookieStore = cookies();
  console.log(type);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("comments")
    .insert({
      content: values.content,
      post: values.postid,
      comment: values.commentid,
    })
    .select();

  if (error) return { error: error };
  return { success: data };
};
