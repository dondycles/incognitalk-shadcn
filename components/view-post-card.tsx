import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PostCard from "./post-card";
import { Button } from "./ui/button";
import { IoReturnUpBack } from "react-icons/io5";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
        <div className="flex w-full justify-between items-start pt-6 px-6 pb-0 -mb-4">
          <Button
            onClick={() => {
              onOpenChange();
            }}
            size={"icon"}
            variant={"outline"}
          >
            <IoReturnUpBack className="text-lg" />
          </Button>
          <Button asChild size={"icon"} variant={"outline"}>
            <Link href={"/post/" + postData?.id}>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <PostCard isView userData={userData} postData={postData} />
      </DialogContent>
    </Dialog>
  );
}
