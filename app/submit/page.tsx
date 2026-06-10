import { SubmitFormPost } from "@/components/post/submit-form-post";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubmitPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-2xl p-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Post</h1>
          <p className="mt-1 text-muted-foreground">
            Signed in as u/{user.username}. Posts use tags instead of
            communities.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
      <SubmitFormPost />
    </div>
  );
}
