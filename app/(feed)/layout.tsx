"use client";
import { getuser } from "@/actions/get-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import UserNavButton from "@/components/user-nav-button";
import FeedNav from "@/components/feed-nav";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FeedLayout() {
  const { data, error, isFetching } = useQuery({
    queryKey: ["user-nav"],
    queryFn: async () => await getuser(),
    refetchOnWindowFocus: false,
  });

  const userData = data;

  return (
    <main className="w-full h-[100dvh] flex flex-col">
      <FeedNav isFetching={isFetching} userData={userData} />
      <ScrollArea>
        <div className="system-padding h-full w-full"></div>
      </ScrollArea>
    </main>
  );
}
