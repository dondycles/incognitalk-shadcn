"use client";

import { ChevronDown, Pencil, Trash, UserCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export default function PostCard({
  post,
  userData,
}: {
  post: any[any];
  userData: any[any];
}) {
  return (
    <Card key={post.id}>
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
                <DropdownMenuItem onClick={() => deletePost(post.id)}>
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
