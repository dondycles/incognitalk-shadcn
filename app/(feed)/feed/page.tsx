"use client";
import { getposts } from "@/actions/get-posts";
import { AddPostForm } from "@/components/add-post-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useOptimisticPost } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { UserCircle } from "lucide-react";

export default function Feed() {
  const optimisticPost = useOptimisticPost();
  const { data: posts, isFetching: postsFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await getposts(),
  });

  const publicPosts = posts;
  return (
    <div className="system-padding h-full w-full space-y-4">
      <AddPostForm close={() => {}} />
      {optimisticPost.content && (
        <Card className="opacity-50">
          <CardHeader>
            <div className="flex flex-row items-center gap-4">
              <UserCircle className="w-10 h-10" />{" "}
              <div className="flex flex-col">
                <p></p>
                <p className="text-muted-foreground text-xs"></p>
              </div>
            </div>
          </CardHeader>
          <CardContent>{optimisticPost.content}</CardContent>
        </Card>
      )}
      {publicPosts?.success?.map((post) => {
        return (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex flex-row items-center gap-4">
                <UserCircle className="w-10 h-10" />{" "}
                <div className="flex flex-col">
                  <p>{post.users.username}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="whitespace-pre">{post.content}</CardContent>
          </Card>
        );
      })}
    </div>
  );
}
