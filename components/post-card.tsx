import {
  ExternalLink,
  Globe,
  Lock,
  LucideLoader2,
  Pencil,
  Trash,
  UserCircle,
} from "lucide-react";
import { IoReturnUpBack } from "react-icons/io5";
import {
  FaRegComment,
  FaRegHeart,
  FaRegShareFromSquare,
} from "react-icons/fa6";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AddCommentForm } from "./add-comment-form";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getcomments } from "@/actions/get-comments";
import { useOptimisticComent } from "@/store";
import CommentCard from "./comment-card";
import { Skeleton } from "./ui/skeleton";
import { HiDotsVertical, HiExternalLink } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { like } from "@/actions/like";
import { getlikes } from "@/actions/get-likes";
import { unlike } from "@/actions/unlike";
import { deletepost } from "@/actions/delete-post";
import ViewPostCard from "./view-post-card";
import { getcommentcount } from "@/actions/get-comment-count";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import { useIntersection } from "@mantine/hooks";
import { getSince } from "@/lib/getSince";

interface PostCard extends React.HTMLProps<HTMLDivElement> {
  userData?: any[any];
  isOptimistic?: boolean;
  optimisticContent?: any[any];
  postData?: any[any];
  isView?: boolean;
}

export default function PostCard({
  userData,
  isOptimistic,
  optimisticContent,
  postData,
  isView,
}: PostCard) {
  const queryClient = useQueryClient();
  const optimisticComment = useOptimisticComent();

  const [viewPost, setViewPost] = useState(false);

  const { data: commentCount, isLoading: commentCountLoading } = useQuery({
    queryKey: ["commentcount", postData?.id],
    queryFn: async () => {
      const { success } = await getcommentcount(postData.id as string);
      return success;
    },
    refetchOnWindowFocus: false,
  });

  const { data: initialComments, isLoading: initialCommentsLoading } = useQuery(
    {
      queryKey: ["initialcomments", postData?.id],
      queryFn: async () => {
        const { success } = await getcomments(postData.id as string, 1, false);
        return success;
      },
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: commentsData,
    isLoading: commentsLoading,
    fetchNextPage: fetchNextComments,
    isFetchingNextPage: isFetchingNextComment,
  } = useInfiniteQuery({
    queryKey: ["comment", postData?.id],
    queryFn: async ({ pageParam }) => {
      const { success } = await getcomments(
        postData.id as string,
        pageParam,
        true
      );
      return success;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    initialPageParam: 1,
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
  });
  const comments: any = commentsData?.pages.flatMap((page) => page);

  const { data: likesData, isLoading: likesDataLoading } = useQuery({
    initialData: postData?.likes,
    queryKey: ["likes", postData?.id],
    staleTime: 0,
    queryFn: async () => {
      const { success } = await getlikes(postData.id as string);
      return success;
    },
    refetchOnMount: false,
  });

  const findMyLike = likesData?.filter(
    (like: any[any]) => like.liker === userData?.id
  );

  const isLiked = findMyLike?.length > 0;
  const [toggleComments, setToggleComments] = useState(false);
  const showComments = commentCount?.length! > 2 || toggleComments;

  const { mutate: _like, isPending: likePending } = useMutation({
    mutationFn: async () => await likePost(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postData.id] });
    },
  });

  const { mutate: _delete, isPending: deletePending } = useMutation({
    mutationFn: async () => deletePost(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const likePost = async () => {
    if (findMyLike.length > 0) {
      const { error } = await unlike(userData.id);
      console.log(error);
      return;
    }
    const { error } = await like({ type: "post", post: postData.id });
    console.log(error);
  };

  const deletePost = async () => {
    const { error, success } = await deletepost(postData.id);
    if (error) return;
  };

  const [delayedLikePending, setDelayedLikePending] = useState(likePending);

  useEffect(() => {
    if (likePending) {
      setDelayedLikePending(true);
    }
    const timeout = setTimeout(() => {
      setDelayedLikePending(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [likePending]);

  const lastComment = useRef<HTMLDivElement>(null);

  const { ref: veryLastComment, entry } = useIntersection({
    root: lastComment.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextComments();
  }, [entry]);

  return (
    <Card
      className={`${
        (isOptimistic && "opacity-50") || (deletePending && "opacity-50")
      } ${
        isView && "border-0 shadow-none p-0  w-full h-full  flex flex-col"
      } modified-card`}
    >
      {isOptimistic && (
        <>
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
            {optimisticContent.content}
          </CardContent>
        </>
      )}
      {postData ? (
        <>
          <CardHeader>
            <div className="flex flex-row items-start gap-4 w-full">
              <UserCircle className="w-10 h-10" />
              <div className="flex flex-col">
                <p className="font-semibold">{postData.users?.username}</p>
                <div className="flex flex-row gap-1 items-center text-muted-foreground">
                  <p className="text-xs">{getSince(postData.created_at)}</p>
                  {postData.privacy === "public" && (
                    <Globe className="w-3 h-3 " />
                  )}
                  {postData.privacy === "private" && (
                    <Lock className="w-3 h-3" />
                  )}
                </div>
              </div>
              <div className="w-fit flex items-center ml-auto mr-0 gap-1">
                {postData.author === userData?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-0 mr-0">
                      <HiDotsVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          _delete(postData.id);
                        }}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="whitespace-pre">
            {postData.content}
          </CardContent>
          <CardFooter className={`gap-4 flex-col self-stretch flex-1`}>
            <div className="grid grid-cols-3 gap-4 w-full">
              <Button
                disabled={delayedLikePending || likesDataLoading}
                onClick={() => _like()}
                size={"sm"}
                variant={isLiked ? "default" : "secondary"}
              >
                <FaRegHeart />
                {likesData?.length ? (
                  <p className="ml-1">{likesData.length}</p>
                ) : null}
              </Button>
              <Button
                disabled={initialCommentsLoading}
                onClick={() => {
                  setToggleComments((prev) => !prev);
                }}
                size={"sm"}
                variant={"secondary"}
              >
                <FaRegComment />{" "}
                {commentCount?.length ? (
                  <p className="ml-1">{commentCount?.length!}</p>
                ) : null}
              </Button>
              <Button size={"sm"} variant={"secondary"}>
                <FaRegShareFromSquare />
              </Button>
            </div>
            {showComments && (
              <>
                <div className="flex flex-col w-full gap-2 h-full">
                  {optimisticComment.data && (
                    <CommentCard
                      userData={userData}
                      key={optimisticComment.data}
                      comment={optimisticComment.data}
                      isOptimistic={true}
                    />
                  )}
                  <ScrollArea className="h-full">
                    <div
                      className={`flex flex-col w-full gap-2 ${
                        isView ? "max-h-[300px]" : "max-h-[300px]"
                      }`}
                    >
                      {isView ? (
                        <>
                          {commentsLoading ? (
                            <p className="text-muted-foreground text-xs">
                              loading comments...
                            </p>
                          ) : showComments ? (
                            <>
                              {comments?.map((comment: any[any]) => {
                                return (
                                  <CommentCard
                                    userData={userData}
                                    key={comment.id}
                                    comment={comment}
                                  />
                                );
                              })}

                              <div
                                ref={veryLastComment}
                                className="pointer-events-none h-0 w-0 m-0 p-0 opacity-0"
                              >
                                HI
                              </div>
                              {isFetchingNextComment && (
                                <div className="text-xs text-muted-foreground flex items-center gap-2 justify-center">
                                  <p>loading more...</p>
                                  <LucideLoader2 className=" animate-spin" />
                                </div>
                              )}
                            </>
                          ) : null}
                        </>
                      ) : (
                        <>
                          {initialCommentsLoading ? (
                            <p className="text-muted-foreground text-xs">
                              loading comments...
                            </p>
                          ) : showComments ? (
                            initialComments?.map((comment: any[any]) => {
                              return (
                                <CommentCard
                                  userData={userData}
                                  key={comment.id}
                                  comment={comment}
                                />
                              );
                            })
                          ) : null}
                        </>
                      )}
                    </div>
                  </ScrollArea>

                  {!isView && (commentCount?.length as number) > 2 && (
                    <Button
                      onClick={() => setViewPost(true)}
                      size={"sm"}
                      variant={"ghost"}
                    >
                      View More
                    </Button>
                  )}
                </div>
                <AddCommentForm postid={postData.id} />
              </>
            )}
          </CardFooter>
        </>
      ) : (
        <>
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
            <Skeleton className="w-full h-8" />
          </CardContent>
        </>
      )}
      {!isView && (
        <ViewPostCard
          postData={postData}
          userData={userData}
          open={viewPost}
          onOpenChange={() => setViewPost((prev) => !prev)}
        />
      )}
    </Card>
  );
}
