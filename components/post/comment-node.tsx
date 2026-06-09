"use client";

import { EnrichedCommentNode } from "@/lib/comment-tree";
import { User } from "@/lib/types";
import { VoteButtons } from "../feed/vote-buttons";
import { Badge } from "../ui/badge";
import { formatRelativeTime } from "@/lib/format";
import { useState } from "react";
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
  console.log(node);
  return (
    <li>
      <div>
        <VoteButtons
          target="comment"
          targetId={node.id}
          score={node.score}
          userVote={node.userVote}
        />
        <div>
          <div></div>
        </div>
      </div>
    </li>
  );
}
