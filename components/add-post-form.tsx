"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { post } from "@/actions/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useOptimisticPost } from "@/store";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "A message cannot be empty.",
  }),
});

export function AddPostForm({ close }: { close: () => void }) {
  const optimisticPost = useOptimisticPost();
  const [queryClient] = useState(() => useQueryClient());
  const {
    mutate: addPost,
    isPending,
    variables,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => onSubmit(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error, success } = await post(values);
    console.log(error, success);
    if (error) return form.setError("content", { message: error.message });
    close();
    form.reset();
  }

  useEffect(() => {
    optimisticPost.setContent(isPending ? variables.content : null);
  }, [isPending]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: z.infer<typeof formSchema>) =>
          addPost(values)
        )}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="What are your thoughts?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-fit ml-auto mr-0"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Post
        </Button>
      </form>
    </Form>
  );
}
