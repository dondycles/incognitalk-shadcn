import {
  ChevronDown,
  Globe,
  Lock,
  Pencil,
  Trash,
  UserCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface PostCard extends React.HTMLProps<HTMLDivElement> {
  post: any[any];
  selectedPost: any[any];
  userData: any[any];
  deletee: (id: any) => void;
}

export default function PostCard({
  post,
  selectedPost,
  userData,
  deletee,
  ...props
}: PostCard) {
  return (
    <Card className={`${post.id === selectedPost?.id && "opacity-50"}`}>
      <CardHeader>
        <div className="flex flex-row items-start gap-4 w-full">
          <UserCircle className="w-10 h-10" />
          <div className="flex flex-col">
            <p>{post.users?.username}</p>
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
                <ChevronDown />
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
    </Card>
  );
}
