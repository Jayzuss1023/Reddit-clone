import { VoteButtons } from "@/components/feed/vote-buttons";
import { CommentComposer } from "@/components/post/comment-composer";
import { CommentThread } from "@/components/post/comment-thread";
// import { CommentComposer } from "@/components/post/comment-composer";
// import { CommentThread } from "@/components/post/comment-thread";
import { Separator } from "@/components/ui/separator";
import { getSessionUser } from "@/lib/auth";
import {
  getAuthorById,
  getCommentTree,
  getPostById,
  getPostScore,
  getUserVote,
  listTags,
} from "@/lib/db/queries";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@neondatabase/auth/react";
import { ArrowLeft, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionUser = await getSessionUser();
  const post = await getPostById(id);
  if (!post) notFound();
  const author = await getAuthorById(post.authorId);

  const score = await getPostScore(post.id);
  const userVote = await getUserVote(sessionUser?.id, "post", post.id);

  const commentTree = await getCommentTree(post.id, sessionUser?.id);

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to feed
        </Link>

        <article className="border border-border bg-card p-4 md:p-6 rounded-xl">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <UserAvatar user={author} size="sm" />
            <span className="font-medium text-foreground">
              u/{author.username}
            </span>
            <span>•</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>
          <h1 className="text-balance text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {post.title}
          </h1>
          <div className="mt-3 flex gap-3">
            {post.tagSlugs.map((tag, index) => (
              <Link
                href={`/$tag=${encodeURIComponent(tag)}`}
                key={tag + index}
                className={cn(
                  "inline-flex rounded-md px-2 py-0.5 text-sm font-medium bg-tag-bg text-tag-text",
                )}
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
            {post.body}
          </div>

          <Separator className="my-6" />

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <VoteButtons
                target="post"
                targetId={post.id}
                score={score}
                userVote={userVote}
              />
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="size-4" />
                {post.commentCount} Comments
              </span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <Share2 className="size-4" />
              Share
            </button>
          </div>
        </article>

        <section className="mt-8 rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2>{post.commentCount} Comments</h2>
          </div>
          {sessionUser ? (
            <div className="mb-8">
              <CommentComposer postId={post.id} user={sessionUser} />
            </div>
          ) : (
            <p>
              <Link href="/auth/sign-in">Log In</Link> to join the discussion.
            </p>
          )}

          <CommentThread
            tree={commentTree}
            postAuthorId={post.authorId}
            sessionUser={sessionUser}
          />
        </section>
      </div>
    </div>
  );
}
