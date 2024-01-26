"use client";
import { getuser } from "@/actions/get-user";

import { useQuery } from "@tanstack/react-query";

import FeedNav from "@/components/feed-nav";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isFetching: userFetching } = useQuery({
    queryKey: ["user-nav"],
    queryFn: async () => await getuser(),
    refetchOnWindowFocus: false,
  });

  const userData = user;

  return (
    <main className="w-full h-[100dvh] flex flex-col">
      <FeedNav isFetching={userFetching} userData={userData} />
      <ScrollArea>{children}</ScrollArea>
    </main>
  );
}
