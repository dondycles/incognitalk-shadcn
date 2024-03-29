"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimisticComent } from "@/store";
import { comment } from "@/actions/comment";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "A message cannot be empty.",
  }),
  postid: z.string(),
});

export function AddCommentForm({ postid }: { postid: string }) {
  const optimisticComment = useOptimisticComent();
  const queryClient = useQueryClient();
  const {
    mutate: addComment,
    variables,
    isPending,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => onSubmit(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment", postid] });
      queryClient.invalidateQueries({ queryKey: ["commentcount", postid] });
      queryClient.invalidateQueries({ queryKey: ["initialcomments", postid] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      postid: postid,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    optimisticComment.setData(variables);

    const { error, success } = await comment(values);
    if (error) return form.setError("content", { message: error.message });
    optimisticComment.setData(null);

    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: z.infer<typeof formSchema>) =>
          addComment(values)
        )}
        className="w-full flex gap-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  cols={1}
                  placeholder="Do you have any comments?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues("content") && (
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sending..." : "Comment"}
          </Button>
        )}
      </form>
    </Form>
  );
}
