"use client";
import { getpost } from "@/actions/get-post";
import PostCard from "@/components/post-card";
import { useQuery } from "@tanstack/react-query";

export default function ViewPost({ params }: { params: { id: string } }) {
  const { data, isFetching } = useQuery({
    queryFn: async () => {
      const { success } = await getpost(params.id);
      return success;
    },
    queryKey: ["post ", params.id],
  });

  return (
    <div className="feed-padding w-full h-[calc(100dvh-74px)] ">
      <PostCard key={params.id} postData={data} />
    </div>
  );
}
