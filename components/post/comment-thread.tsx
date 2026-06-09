import { EnrichedCommentNode } from "@/lib/comment-tree";
import { User } from "@/lib/types";
import { CommentNode } from "./comment-node";

export function CommentThread({
  tree,
  postAuthorId,
  sessionUser,
}: {
  tree?: EnrichedCommentNode[];
  postAuthorId: string;
  sessionUser: User | null;
}) {
  if (!tree) {
    return <p>No comments yet. Be the first to share your thoughts</p>;
  }

  return (
    <ul>
      {tree.map((node) => (
        <CommentNode
          key={node.id}
          node={node}
          postAuthorId={postAuthorId}
          sessionUser={sessionUser}
        />
      ))}
    </ul>
  );
}
