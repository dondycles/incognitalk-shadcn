import { UserCircle } from "lucide-react";

export default function CommentCard({
  comment,
  isOptimistic,
}: {
  comment: any[any];
  isOptimistic?: boolean;
}) {
  return (
    <div className="w-full flex flex-row items-start gap-2">
      <UserCircle />
      <div className="flex-1 flex flex-col rounded-[0.5rem] bg-secondary p-2">
        {!isOptimistic && (
          <p className="font-semibold">{comment.users.username}</p>
        )}
        <p>{comment.comment}</p>
      </div>
    </div>
  );
}
