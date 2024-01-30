"use client";
import { getposts } from "@/actions/get-posts";
import { AddPostForm } from "@/components/add-post-form";
import { useIntersection } from "@mantine/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOptimisticPost } from "@/store";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { LucideLoader2 } from "lucide-react";

import { getauth } from "@/actions/get-auth";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/post-card";
import { Input } from "@/components/ui/input";

export default function Feed() {
  const optimisticPost = useOptimisticPost();

  const [isCreatePost, setIsCreatePost] = useState(false);

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      const { success, error } = await getposts(pageParam);
      return success;
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialPageParam: 1,
    refetchOnMount: false,
  });

  const { data: user } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => await getauth(),
  });

  const publicPosts = posts?.pages.flatMap((page) => page);

  const userData = user?.success?.user;

  const lastPost = useRef<HTMLDivElement>(null);

  const { ref: veryLastPost, entry } = useIntersection({
    root: lastPost.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry]);

  return (
    <div className="feed-padding h-full w-full space-y-4">
      {!isCreatePost ? (
        <Card className="modified-card">
          <CardHeader>
            <div className="flex flex-row gap-4 w-full">
              <Input
                onFocus={() => setIsCreatePost(true)}
                placeholder="Got something to share?"
              />
              <Button onClick={() => setIsCreatePost(true)}>Create Post</Button>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <Card className="modified-card">
          <CardHeader>
            <CardDescription>Create Post</CardDescription>
          </CardHeader>
          <CardContent>
            <AddPostForm
              close={() => {
                setIsCreatePost(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      {optimisticPost.data && (
        <PostCard
          isOptimistic={true}
          key={"opt"}
          optimisticContent={optimisticPost.data}
        />
      )}
      {isLoading
        ? Array.from({ length: 10 }, (_, i) => (
            <Card key={i} className="modified-card">
              <CardHeader>
                <div className="flex flex-row items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="whitespace-pre">
                <Skeleton className="w-full h-16" />
              </CardContent>
            </Card>
          ))
        : publicPosts?.map((post, i) => {
            if (i === publicPosts.length - 1) {
              return (
                <PostCard key={post?.id} userData={userData} postData={post} />
              );
            }
            return (
              <PostCard key={post?.id} userData={userData} postData={post} />
            );
          })}
      <div />
      {isFetchingNextPage && (
        <div className="text-xs text-muted-foreground flex items-center gap-2 justify-center">
          <p>loading more...</p>
          <LucideLoader2 className=" animate-spin" />
        </div>
      )}
      <div
        ref={veryLastPost}
        className="pointer-events-none h-0 w-0 m-0 p-0 opacity-0"
      />
    </div>
  );
}
