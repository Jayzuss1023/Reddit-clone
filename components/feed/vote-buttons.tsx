"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { voteCommentAction } from "@/lib/actions/comment";
import { votePostAction } from "@/lib/actions/post";
// import { voteCommentAction } from "@/lib/actions/comments";
// import { votePostAction } from "@/lib/actions/posts";
import { cn } from "@/lib/utils";

type VoteTarget = "post" | "comment";

export function VoteButtons({
  target,
  targetId,
  score,
  userVote,
}: {
  target: VoteTarget;
  targetId: string;
  score: number;
  userVote: -1 | 0 | 1;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const isPost = target === "post";

  function vote(value: -1 | 1) {
    startTransition(async () => {
      if (isPost) {
        await votePostAction(targetId, value);
      } else {
        await voteCommentAction(targetId, value);
      }
      router.refresh();
    });
  }

  const scoreClass = isPost
    ? "min-w-[2ch] text-center gap-0.5 py-1 text-sm"
    : "min-1-[1.5ch] text-center gap-0 text-xs";

  return (
    <div
      className={cn(
        "flex flex-col items-center",
        isPost ? "gap-0.5 py-1 text-sm" : "gap-0 text-xs",
      )}
    >
      <button
        type="button"
        onClick={() => vote(1)}
        disabled={pending || userVote === 1}
        className={cn(
          "rounded p-0.5 transition-colors hover:bg-muted disabled:opacity-50",
          userVote === 1
            ? "text-upvote"
            : "text-muted-foreground hover:text-upvote",
        )}
        aria-label={isPost ? "upvote" : "Upvote comment"}
      >
        <ChevronUp className={cn(isPost ? "size-6" : "size-4")} />
      </button>
      <span
        className={cn(
          scoreClass,
          userVote === 1 && "text-upvote",
          userVote === -1 && "text-downvote",
        )}
      >
        {score}
      </span>
      <button
        type="button"
        onClick={() => vote(-1)}
        disabled={pending || userVote === -1}
        className={cn(
          "rounded p-0.5 transition-colors hover:bg-muted disabled:opacity-50",
          userVote === -1
            ? "text-downvote"
            : "text-muted-foreground hover:text-downvote",
        )}
        aria-label={isPost ? "Downvote" : "Downvote comment"}
      >
        <ChevronDown />
      </button>
    </div>
  );
}
