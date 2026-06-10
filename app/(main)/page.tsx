import { FeedSortTabs } from "@/components/feed/feed-sort-tab";
import { PostCard } from "@/components/feed/post-card";
import { getSessionUser } from "@/lib/auth";
import {
  batchAuthorsForIds,
  listPostsSorted,
  listTags,
} from "@/lib/db/queries";
import type { FeedSort } from "@/lib/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; tag?: string }>;
}) {
  const sp = await searchParams;
  const sortRaw = sp.sort;
  const sort: FeedSort =
    sortRaw === "new" || sortRaw === "top" ? sortRaw : "hot";

  const tagFilter = sp.tag?.toLowerCase();

  const sessionUser = await getSessionUser();
  const rows = await listPostsSorted(sort, tagFilter, sessionUser?.id);

  const tags = await listTags();
  const tagMap = new Map(tags.map((t) => [t.slug, t]));

  const authorIds = [...new Set(rows.map((r) => r.post.authorId))];
  const authorById = await batchAuthorsForIds(authorIds);

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        <FeedSortTabs current={sort} tag={tagFilter} />
        <div className="space-y-4">
          {!rows || rows.length === 0 ? (
            <div>No post match this filter</div>
          ) : (
            rows.map((r) => {
              const author = authorById.get(r.post.authorId);
              if (!author) return null;
              return (
                <PostCard
                  key={r.post.id}
                  post={r.post}
                  author={author}
                  tagsBySlug={tagMap}
                  score={r.score}
                  userVote={r.userVote}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
