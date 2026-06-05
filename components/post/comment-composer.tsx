"use client";
import { User } from "@/lib/types";
import { UserAvatar } from "@neondatabase/auth/react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import React, { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCommentAction } from "@/lib/actions/comment";

export function CommentComposer({
  postId,
  user,
  parentId = null,
  placeholder = "Add a comment",
  compact = false,
}: {
  postId: string;
  user: User;
  parentId?: string | null;
  placeholder?: string;
  compact?: boolean;
}) {
  const formRef = useRef(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    startTransition(async () => {
      const newComment = await createCommentAction(null, fd, postId, parentId);

      if (newComment?.error) {
        setError(newComment.error);
        return;
      }
      form.reset();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} className="flex gap-3" onSubmit={onSubmit}>
      <UserAvatar
        user={user}
        size={compact ? "sm" : "default"}
        className="mt-1 shrink-0"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <Textarea
          name="body"
          required
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className="min-h-0 resize-y border-border bg-card text-sm"
        />
        {error ? <p>{error}</p> : null}
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Posting..." : parentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </form>
  );
}
