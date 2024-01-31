import { Pencil, Trash, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { deletecomment } from "@/actions/delete-comment";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { HiDotsVertical } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { EditCommentForm } from "./edit-comment-form";
import { getSince } from "@/lib/getSince";
import { AddUgCommentForm } from "./add-ugcomment-form";
import UgCommentCard from "./ug-comment-card";
import { useOptimisticUgComment } from "@/store";
import { getugcomments } from "@/actions/get-ug-comments";
import { useIntersection } from "@mantine/hooks";

interface CommentCard extends React.HTMLProps<HTMLDivElement> {
  comment: any[any];
  userData: any[any];
  isOptimistic?: boolean;
  type?: string;
  isView?: boolean;
}

export default function CommentCard({
  comment,
  isOptimistic,
  userData,
  type,
  isView,
  ...props
}: CommentCard) {
  const queryClient = useQueryClient();
  const [isCommenting, setIsCommenting] = useState(false);

  const { data: initialUgComments, isLoading: initialUgCommentsLoading } =
    useQuery({
      queryKey: ["initialugcomments", comment?.id],
      queryFn: async () => {
        const { success } = await getugcomments(
          comment?.id as string,
          1,
          false
        );
        return success;
      },
      refetchOnWindowFocus: false,
    });

  const {
    data: ugCommentsData,
    isLoading: ugCommentsLoading,
    fetchNextPage: fetchNextUgComments,
    isFetchingNextPage: isFetchingNextUgComment,
  } = useInfiniteQuery({
    queryKey: ["ugcomment", comment?.id],
    queryFn: async ({ pageParam }) => {
      const { success } = await getugcomments(
        comment?.id as string,
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
  const ugcomments: any = ugCommentsData?.pages.flatMap((page) => page);

  const { mutate: delete_, isPending: deletePending } = useMutation({
    mutationFn: async () => deleteComment(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["initialcomments", comment.post],
      });
    },
  });

  const isEditable = userData?.id === comment?.users?.id;
  const isDeletable =
    userData?.id === comment?.users?.id ||
    userData?.id === comment?.posts?.author;

  const [editing, setEditing] = useState(false);

  const deleteComment = async () => {
    const { success, error } = await deletecomment(comment.id);
    console.log(error);
  };

  const optimisticUgComments = useOptimisticUgComment();

  const lastComment = useRef<HTMLDivElement>(null);

  const { ref: veryLastComment, entry } = useIntersection({
    root: lastComment.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextUgComments();
  }, [entry]);

  return (
    <div
      className={`w-full flex flex-row items-start gap-2 ${
        deletePending && "opacity-50"
      } ${isOptimistic && "opacity-50"}`}
    >
      <UserCircle />
      <div className="flex-1 flex flex-col items-start gap-1">
        <div className="flex-1 flex flex-col  rounded-[0.5rem] bg-secondary p-2 w-full">
          {!isOptimistic && (
            <div className="flex flex-row">
              <p className="font-semibold flex-1">{comment.users.username}</p>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <HiDotsVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isEditable && (
                    <DropdownMenuItem
                      onClick={() => {
                        setEditing(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                  )}

                  {isDeletable && (
                    <DropdownMenuItem
                      onClick={() => {
                        delete_();
                      }}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}

                  {!isEditable && !isDeletable && (
                    <DropdownMenuItem>Can't do actions</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {editing ? (
            <EditCommentForm
              onSuccess={() => setEditing(false)}
              comment={comment}
            />
          ) : (
            <p className="whitespace-pre">{comment.content}</p>
          )}
        </div>

        <div className="text-sm flex flex-row gap-1">
          <p>{getSince(comment.created_at)}</p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="min-h-0 h-fit w-fit min-w-0"
          >
            Like
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="min-h-0 h-fit w-fit min-w-0"
            onClick={() => {
              setIsCommenting((prev) => !prev);
            }}
          >
            Comment
          </Button>
        </div>
        {isCommenting && (
          <AddUgCommentForm commentid={comment.id} postid={comment.post} />
        )}
        {optimisticUgComments.data && (
          <UgCommentCard
            userData={userData}
            key={optimisticUgComments.data}
            comment={optimisticUgComments.data}
            isOptimistic={true}
          />
        )}
        {isView ? (
          ugcomments?.length ? (
            <div className="w-full space-y-1 border-l-border border-l-solid border-l-[1px] pl-2">
              {ugcomments?.map((comment: any) => {
                return (
                  <UgCommentCard
                    key={comment.id}
                    userData={userData}
                    comment={comment}
                  />
                );
              })}
            </div>
          ) : null
        ) : (
          <div className="w-full space-y-1 border-l-border border-l-solid border-l-[1px] pl-2">
            {initialUgComments?.map((comment: any) => {
              return (
                <UgCommentCard
                  key={comment.id}
                  userData={userData}
                  comment={comment}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
