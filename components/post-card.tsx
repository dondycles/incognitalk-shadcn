import {
  ChevronDown,
  Globe,
  Lock,
  Pencil,
  Trash,
  UserCircle,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { AddCommentForm } from "./add-comment-form";
import { useQuery } from "@tanstack/react-query";
import { getcomments } from "@/actions/get-comments";
import { useOptimisticComent } from "@/store";
import CommentCard from "./comment-card";
import { Skeleton } from "./ui/skeleton";
import { HiDotsVertical } from "react-icons/hi";

interface PostCard extends React.HTMLProps<HTMLDivElement> {
  post?: any[any];
  selectedPost?: any[any];
  userData?: any[any];
  deletee: (id: any) => void;
  isOptimistic?: boolean;
}

export default function PostCard({
  post,
  selectedPost,
  userData,
  deletee,
  isOptimistic,
  ...props
}: PostCard) {
  const { data } = useQuery({
    queryKey: ["comment", post.id],
    queryFn: async () => await getcomments(post),
  });

  const comments = data?.success;

  const optimisticComment = useOptimisticComent();

  return (
    <Card
      className={`${post.id === selectedPost?.id && "opacity-50"} ${
        isOptimistic && "opacity-50"
      }`}
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
          <CardContent className="whitespace-pre">{post.content}</CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <div className="flex flex-row items-start gap-4 w-full">
              <UserCircle className="w-10 h-10" />
              <div className="flex flex-col">
                <p className="font-semibold">{post.users?.username}</p>
                <div className="flex flex-row gap-1 items-center text-muted-foreground">
                  <p className="text-xs">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  {post.privacy === "public" && <Globe className="w-3 h-3 " />}
                  {post.privacy === "private" && <Lock className="w-3 h-3" />}
                </div>
              </div>
              {post.author === userData?.id && (
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
                        deletee(post.id);
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
          <CardContent className="whitespace-pre">{post.content}</CardContent>
          <CardFooter className="gap-4 flex-col">
            <Separator />
            <div className="flex flex-col w-full gap-2">
              {optimisticComment.data && (
                <CommentCard
                  userData={userData}
                  key={"opt"}
                  comment={optimisticComment.data}
                  isOptimistic={true}
                />
              )}
              {comments?.map((comment: any[any]) => {
                return (
                  <CommentCard
                    userData={userData}
                    key={comment.id}
                    comment={comment}
                  />
                );
              })}
            </div>

            <AddCommentForm postid={post.id} />
          </CardFooter>
        </>
      )}
    </Card>
  );
}
