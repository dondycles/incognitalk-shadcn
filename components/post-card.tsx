import {
  ChevronDown,
  Globe,
  Heart,
  Lock,
  Pencil,
  Quote,
  Share,
  Share2,
  Trash,
  UserCircle,
} from "lucide-react";
import {
  FaComment,
  FaHeart,
  FaRegComment,
  FaRegHeart,
  FaRegShareFromSquare,
  FaShare,
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
import { useState } from "react";
import { Button } from "./ui/button";
import { like } from "@/actions/like";
import { getpost } from "@/actions/get-post";
import { getlikes } from "@/actions/get-likes";
import { unlike } from "@/actions/unlike";

interface PostCard extends React.HTMLProps<HTMLDivElement> {
  selectedPost?: any[any];
  userData?: any[any];
  deletee: (id: any) => void;
  isOptimistic?: boolean;
  optimisticContent?: any[any];
  postData?: any[any];
}

export default function PostCard({
  selectedPost,
  userData,
  deletee,
  isOptimistic,
  optimisticContent,
  postData,
}: PostCard) {
  // const {
  //   data: a,
  //   error,
  //   fetchNextPage,
  //   isFetchingNextPage,
  // } = useInfiniteQuery({
  //   queryKey: ["comment", post.id],
  //   queryFn: async () => {
  //     const { success } = await getcomments(post);
  //     return success;
  //   },
  //   initialPageParam: 1,
  //   getNextPageParam: (_, pages) => {
  //     return pages.length + 1;
  //   },
  // });
  const [toggleComments, setToggleComments] = useState(false);
  const queryClient = useQueryClient();
  const optimisticComment = useOptimisticComent();

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    initialData: postData.comments,
    queryKey: ["comment", postData.id],
    staleTime: 0,
    queryFn: async () => {
      const { success } = await getcomments(postData.id as string);
      return success;
    },
    refetchOnMount: false,
  });

  const comments = commentsData;

  const { data: likesData, isLoading: likesLoading } = useQuery({
    initialData: postData.likes,
    queryKey: ["likes", postData.id],
    staleTime: 0,
    queryFn: async () => {
      const { success } = await getlikes(postData.id as string);
      return success;
    },
    refetchOnMount: false,
  });

  const likes: [] = likesData;

  const isLiked = likes.filter((like: any[any]) => like.liker === userData?.id);

  const iLikedIt = isLiked.length > 0 ? true : false;

  const { mutate: _like } = useMutation({
    mutationFn: async () => await likee(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["likes", postData.id],
      });
    },
  });

  const likee = async () => {
    if (likesLoading) return;
    if (iLikedIt) {
      const { error } = await unlike(userData.id);
      console.log(error);
      return;
    }
    if (!iLikedIt) {
      const { error } = await like({ type: "post", post: postData.id });
      console.log(error);
      return;
    }
  };

  const showComments = comments?.length! > 2 || toggleComments;

  return (
    <Card
      className={`${postData.id === selectedPost?.id && "opacity-50"} ${
        isOptimistic && "opacity-50"
      } border-transparent border-b-border sm:border-border shadow-none sm:shadow-sm rounded-none sm:rounded-lg`}
    >
      {isOptimistic ? (
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
      ) : postData ? (
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
                        deletee(postData.id);
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
                onClick={() => {
                  _like();
                }}
                size={"sm"}
                variant={iLikedIt ? "default" : "secondary"}
              >
                <FaRegHeart />
                {likes?.length ? <p className="ml-1">{likes?.length}</p> : null}
              </Button>
              <Button
                onClick={() => {
                  setToggleComments((prev) => !prev);
                }}
                size={"sm"}
                variant={"secondary"}
              >
                <FaRegComment />{" "}
                {comments?.length ? (
                  <p className="ml-1">{comments?.length!}</p>
                ) : null}
              </Button>
              <Button size={"sm"} variant={"secondary"}>
                <FaRegShareFromSquare />
              </Button>
            </div>
            {showComments && (
              <div className="flex flex-col w-full gap-2">
                {optimisticComment.data && (
                  <CommentCard
                    userData={userData}
                    key={optimisticComment.data}
                    comment={optimisticComment.data}
                    isOptimistic={true}
                  />
                )}

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
            )}
            {showComments && <AddCommentForm postid={postData.id} />}
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
    </Card>
  );
}
