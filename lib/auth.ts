import { createNeonAuth } from "@neondatabase/auth/next/server";
import { cache } from "react";
import { ensureUserProfile } from "./db/user-profile";
import type { User } from "./types";

if (!process.env.NEON_AUTH_BASE_COOKIE_SECRET)
  throw new Error("NEON AUTH BASE COOKIE SECRET SET");

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_BASE_COOKIE_SECRET,
  },
});

export const getCurrentUserId = cache(async (): Promise<string | undefined> => {
  const { data: session } = await auth.getSession();
  return session?.user.id;
});

export const getSessionUser = cache(async (): Promise<User | null> => {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;
  return ensureUserProfile(session.user);
});
