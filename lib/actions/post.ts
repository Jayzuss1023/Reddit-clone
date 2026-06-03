"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "../auth";
import { getUserVote } from "../db/queries";
import { prisma } from "../prisma";

export async function votePostAction(postId: string, value: -1 | 1) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { error: "Sign in to vote" };
  }

  await votePost(userId, postId, value);
  revalidatePath("/");
  revalidatePath(`/post/${postId}`);
}

export async function votePost(userId: string, postId: string, value: -1 | 1) {
  const current = await getUserVote(userId, "post", postId);

  if (current === value) return;
  await prisma.vote.deleteMany({
    where: {
      userId,
      targetType: "post",
      targetId: postId,
    },
  });

  if (!current) {
    await prisma.vote.create({
      data: {
        userId,
        targetType: "post",
        targetId: postId,
        value: value,
      },
    });
  }
}
