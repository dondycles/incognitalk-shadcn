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
import { useState } from "react";
import { EditCommentForm } from "./edit-comment-form";

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
    userData?.id === comment?.users?.id ||
    userData?.id === comment?.posts?.author;

  const [editing, setEditing] = useState(false);

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
        <div className="flex-1 flex flex-col">
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
            <p className="whitespace-pre">{comment.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
