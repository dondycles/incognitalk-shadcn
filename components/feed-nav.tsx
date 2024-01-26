"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import UserNavButton from "./user-nav-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { AddPostForm } from "./add-post-form";
import { useState } from "react";

export default function FeedNav({
  isFetching,
  userData,
}: {
  isFetching: boolean;
  userData: any;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <nav className="system-padding w-full flex items-center justify-between">
      <p className="font-bold text-lg sm:text-2xl">incognitalk.</p>
      <div className="flex items-center gap-4">
        <Dialog onOpenChange={setOpenDialog} open={openDialog}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <Plus />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Create</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Pencil className="w-4 h-4 mr-2" />
                  Post
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
            </DialogHeader>
            <AddPostForm close={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>

        {isFetching ? (
          <Skeleton className="h-[40px] w-[40px] py-2 px-4"></Skeleton>
        ) : (
          <UserNavButton userData={userData} />
        )}
      </div>{" "}
    </nav>
  );
}
