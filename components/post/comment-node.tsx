"use client";

import { useState } from "react";
import type { EnrichedCommentNode } from "@/lib/comment-tree";
import { formatRelativeTime } from "@/lib/format";
import type { User } from "@/lib/types";
import { VoteButtons } from "../feed/vote-buttons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CommentComposer } from "./comment-composer";

export function CommentNode({
  node,
  postAuthorId,
  sessionUser,
}: {
  node: EnrichedCommentNode;
  postAuthorId: string;
  sessionUser: User | null;
}) {
  const isOp = node.authorId === postAuthorId;
  const [showReply, setShowReply] = useState(false);
  return (
    <li className="relative">
      <div className="flex gap-2">
        <VoteButtons
          target="comment"
          targetId={node.id}
          score={node.score}
          userVote={node.userVote}
        />
        <div className="min-w-0 flex-1 border-l border-border pl-3">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">u/{node.author}</span>
            {isOp ? (
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-semibold uppercase"
              >
                OP
              </Badge>
            ) : null}
            <span>•</span>
            <span>{formatRelativeTime(node.createdAt)}</span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {node.body}
          </p>
          <div className="flex flex-wrap mt-2 items-center gap-3 text-xs font-medium text-muted-foreground">
            {sessionUser ? (
              <Button
                variant="secondary"
                className="hover:text-foreground"
                onClick={() => setShowReply((v) => !v)}
              >
                Reply
              </Button>
            ) : null}
            <Button className="hover:text-foreground">Share</Button>
          </div>

          {sessionUser && showReply && (
            <div className="mt-3 border-t border-border pt-3">
              <CommentComposer
                postId={node.postId}
                user={sessionUser}
                parentId={node.id}
                placeholder="Write a reply..."
                compact
              />
            </div>
          )}

          {node.children.length > 0 && (
            <ul className="mt-4 border-t border-border pt-3">
              {node.children.map((ch) => (
                <CommentNode
                  key={ch.id}
                  node={ch}
                  postAuthorId={postAuthorId}
                  sessionUser={sessionUser}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}
