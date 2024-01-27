"use client";
import { getposts } from "@/actions/get-posts";
import { AddPostForm } from "@/components/add-post-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOptimisticPost } from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Pencil, Trash, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getauth } from "@/actions/get-auth";
import { deletepost } from "@/actions/delete-post";
import { useEffect, useState } from "react";

export default function Feed() {
  const queryClient = useQueryClient();

  const optimisticPost = useOptimisticPost();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await getposts(),
  });

  const { data: user } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => await getauth(),
  });

  const publicPosts = posts;
  const userData = user?.success?.user;

  const [selectedPost, setSelectedPost] = useState<any>(null);

  const { mutate: delete_, isPending } = useMutation({
    mutationFn: async () => deletePost(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deletePost = async () => {
    const { error, success } = await deletepost(selectedPost.id);
    if (error) return;
  };

  return (
    <div className="system-padding h-full w-full space-y-4">
      <AddPostForm close={() => {}} />
      {optimisticPost.content && (
        <Card className="opacity-50">
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
            {optimisticPost.content}
          </CardContent>
        </Card>
      )}
      {isLoading
        ? Array.from({ length: 10 }, (_, i) => (
            <Card key={i}>
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
        : publicPosts?.success?.map((post) => {
            return (
              <Card
                key={post.id}
                className={`${post.id === selectedPost?.id && "opacity-50"}`}
              >
                <CardHeader>
                  <div className="flex flex-row items-start gap-4 w-full">
                    <UserCircle className="w-10 h-10" />
                    <div className="flex flex-col">
                      <p>{post.users?.username}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {post.author === userData?.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="ml-auto mr-0">
                          <ChevronDown />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPost(post);
                              delete_();
                            }}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="whitespace-pre">
                  {post.content}
                </CardContent>
              </Card>
            );
          })}
    </div>
  );
}
