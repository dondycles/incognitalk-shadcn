import FeedNav from "@/components/feed-nav";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-[100dvh] flex flex-col">
      <FeedNav />
      <ScrollArea>{children}</ScrollArea>
    </main>
  );
}
