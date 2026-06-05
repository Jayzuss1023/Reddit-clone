"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "../auth";
import { prisma } from "../prisma";
import { Comment } from "../types";

export type CommentFormState = { error?: string; ok?: boolean } | null;

export async function createCommentAction(
  _prev: CommentFormState,
  formData: FormData,
  postId: string,
  parentId?: string | null,
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { error: "You must be signed in to comment." };
  }

  formData.set("postId", postId);
  formData.set("parentId", parentId || "");

  const fdPostId = String(formData.get("postId"));
  const fdParentId = String(formData.get("parentId"));
  const fdBody = String(formData.get("body"));

  if (!fdPostId || fdBody.trim().length < 1) {
    return { error: "Comment cannot be empty." };
  }

  await addComment({
    postId: fdPostId,
    authorId: userId,
    parentId: fdParentId || null,
    body: fdBody.trim(),
  });

  revalidatePath(`/post/${postId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function addComment(input: {
  postId: string;
  authorId: string;
  parentId: string | null;
  body: string;
}): Promise<void> {
  const row = await prisma.comment.create({
    data: {
      postId: input.postId,
      authorId: input.authorId,
      parentId: input.parentId,
      body: input.body.trim(),
    },
  });
}
