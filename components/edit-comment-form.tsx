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
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { editcomment } from "@/actions/edit-comment";

const formSchema = z.object({
  comment: z.string().min(1, {
    message: "A message cannot be empty.",
  }),
  id: z.string(),
});

export function EditCommentForm({
  comment,
  onSuccess,
}: {
  comment: any[any];
  onSuccess: () => void;
}) {
  const [queryClient] = useState(() => useQueryClient());
  const { mutate: addComment, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => onSubmit(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comment", comment.posts.id],
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: comment.comment,
      id: comment.id,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error, success } = await editcomment(values);
    console.log(error);
    if (error) return form.setError("comment", { message: error.message });

    form.reset();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: z.infer<typeof formSchema>) =>
          addComment(values)
        )}
        className={`w-full flex gap-4 mt-4 ${isPending && "opacity-50"}`}
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea cols={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues("comment") && (
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sending..." : "Edit"}
          </Button>
        )}
      </form>
    </Form>
  );
}
