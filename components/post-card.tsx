import { Globe, Lock, Pencil, Trash, UserCircle } from "lucide-react";
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
import { HiDotsVertical } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { like } from "@/actions/like";
import { getpost } from "@/actions/get-post";
import { getlikes } from "@/actions/get-likes";
import { unlike } from "@/actions/unlike";
import { deletepost } from "@/actions/delete-post";
import ViewPostCard from "./view-post-card";
import { getcommentcount } from "@/actions/get-comment-count";
import { ScrollArea } from "./ui/scroll-area";

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

  const { data: commentsData, isLoading: commentsLoading } = useInfiniteQuery({
    queryKey: ["comment", postData?.id],
    queryFn: async ({ pageParam }) => {
      const { success } = await getcomments(
        postData.id as string,
        pageParam,
        isView
      );
      return success;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialPageParam: 1,
  });
  const comments = commentsData?.pages.flatMap((page) => page);
  const { data: likesData } = useQuery({
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
  const showComments = comments?.length! > 2 || toggleComments;

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

  return (
    <Card
      className={`${
        (isOptimistic && "opacity-50") || (deletePending && "opacity-50")
      } ${isView && "border-0 shadow-none p-0"} modified-card `}
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
                  <p className="text-xs">
                    {new Date(postData.created_at).toLocaleDateString()}
                  </p>
                  {postData.privacy === "public" && (
                    <Globe className="w-3 h-3 " />
                  )}
                  {postData.privacy === "private" && (
                    <Lock className="w-3 h-3" />
                  )}
                </div>
              </div>
              {postData.author === userData?.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="ml-auto mr-0">
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
          </CardHeader>
          <CardContent className="whitespace-pre">
            {postData.content}
          </CardContent>
          <CardFooter className={`gap-4 flex-col`}>
            <div className="grid grid-cols-3 gap-4 w-full">
              <Button
                disabled={delayedLikePending}
                onClick={() => _like()}
                size={"sm"}
                variant={isLiked ? "default" : "secondary"}
              >
                <FaRegHeart />
                {likesData.length ? (
                  <p className="ml-1">{likesData.length}</p>
                ) : null}
              </Button>
              <Button
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
                <div className="flex flex-col w-full gap-2">
                  {optimisticComment.data && (
                    <CommentCard
                      userData={userData}
                      key={optimisticComment.data}
                      comment={optimisticComment.data}
                      isOptimistic={true}
                    />
                  )}
                  <ScrollArea>
                    <div className="flex flex-col w-full gap-2 max-h-[300px]">
                      {commentsLoading ? (
                        <p className="text-muted-foreground text-xs">
                          loading comments...
                        </p>
                      ) : showComments ? (
                        comments?.map((comment: any[any]) => {
                          return (
                            <CommentCard
                              userData={userData}
                              key={comment.id}
                              comment={comment}
                            />
                          );
                        })
                      ) : null}
                    </div>
                  </ScrollArea>

                  {!isView && comments!.length > 3 && (
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
