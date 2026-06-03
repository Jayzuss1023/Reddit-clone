import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function JoinCtaCard() {
  return (
    <Card>
      <CardHeader>
        <div>🤖</div>
        <CardTitle>Join the conversation</CardTitle>
        <CardDescription>
          Create posts, vote, and follow tags your care about.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/auth/sign-up"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full justify-center",
          )}
        >
          Sign up
        </Link>
      </CardContent>
    </Card>
  );
}
