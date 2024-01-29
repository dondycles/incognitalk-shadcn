import { Pencil, Trash, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { deletecomment } from "@/actions/delete-comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiDotsVertical } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function CommentCard({
  comment,
  isOptimistic,
  userData,
}: {
  comment: any[any];
  userData: any[any];
  isOptimistic?: boolean;
}) {
  const queryClient = useQueryClient();

  const { mutate: delete_, isPending } = useMutation({
    mutationFn: async () => deleteComment(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comment", comment.posts.id],
      });
    },
  });

  const isEditable = userData?.id === comment?.users?.id;
  const isDeletable =
    userData?.id === comment?.users?.id || comment?.posts?.author;

  const deleteComment = async () => {
    const { success, error } = await deletecomment(comment.id);
    console.log(error);
  };

  return (
    <div
      className={`w-full flex flex-row items-start gap-2 ${
        isPending && "opacity-50"
      } ${isOptimistic && "opacity-50"}`}
    >
      <UserCircle />
      <div className="flex-1 flex flex-row rounded-[0.5rem] bg-secondary p-2 items-start">
        <div className="flex-1">
          {!isOptimistic && (
            <p className="font-semibold">{comment.users.username}</p>
          )}
          <p className="whitespace-pre">{comment.comment}</p>
        </div>{" "}
        {!isOptimistic && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <HiDotsVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isEditable && (
                <DropdownMenuItem>
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

              {/* {comment.posts.author === userData.id ? (
                <DropdownMenuItem
                  onClick={() => {
                    delete_();
                  }}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              ) : userData.id === comment.users.id ? (
                <DropdownMenuItem
                  onClick={() => {
                    delete_();
                  }}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              ) : null} */}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {/* {!isOptimistic && userData.id === comment.users.id && (
        <Button onClick={() => delete_()} size={"icon"} variant={"destructive"}>
          <Trash />
        </Button>
      )} */}
    </div>
  );
}
