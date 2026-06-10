"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useActionState } from "react";
import { createPostAction } from "@/lib/actions/post";

export function SubmitFormPost() {
  const [state, action, pending] = useActionState(createPostAction, null);

  return (
    <form
      action={action}
      className="flex flex-col gap-5 border p-7 rounded-xl bg-card w-lg"
    >
      <div className="space-y-2 ">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          minLength={4}
          placeholder="What's on your mind?"
          className="h-10"
        />
      </div>
      <div className="space-y-2 border-t pt-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          name="body"
          rows={8}
          placeholder="Optional details, links, or context..."
          className="border-bodder bg-card "
        />
      </div>
      <div className="space-y-2 border-t pt-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="webdev, react, nextjs"
          className="h-10"
        />
        <p className="text-xs text-destructive">
          Comma-seperated. Defaults to #webdev if empty
        </p>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Publishing..." : "Publish Post"}
      </Button>
    </form>
  );
}
