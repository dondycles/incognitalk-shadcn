import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";
import PostCard from "./post-card";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

export default function ViewPostCard({
  open,
  onOpenChange,
  userData,
  postData,
}: {
  open: boolean;
  onOpenChange: () => void;
  userData: any[any];
  postData: any[any];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger hidden />
      <DialogContent className=" p-0">
        <PostCard isView userData={userData} postData={postData} />
      </DialogContent>
    </Dialog>
  );
}
