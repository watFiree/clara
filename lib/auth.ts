import { cookies } from "next/headers";
import { withAuth } from "@workos-inc/authkit-nextjs";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { isCloudMode, COOKIE_NAME } from "@/config";

export async function getOrCreateUser() {
  // Cloud mode: check WorkOS session first
  if (isCloudMode) {
    const { user: workosUser } = await withAuth();
    if (workosUser) {
      const user = await prisma.user.findUnique({
        where: { providerId: workosUser.id },
      });
      if (user) return user;
    }
  }

  // Fallback: anonymous cookie (works in both modes)
  const cookieStore = await cookies();
  const cookieId = cookieStore.get(COOKIE_NAME)?.value;

  if (!cookieId) throw new Error("Missing clara_user_id cookie");

  // Try to find existing user first, create if missing.
  // Catch unique constraint errors from concurrent requests.
  const existing = await prisma.user.findUnique({ where: { id: cookieId } });
  if (existing) return existing;

  try {
    return await prisma.user.create({ data: { id: cookieId } });
  } catch (e: unknown) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      // Another concurrent request already created it — just fetch it.
      const user = await prisma.user.findUnique({ where: { id: cookieId } });
      if (!user)
        throw new Error("User creation race: record not found after P2002");
      return user;
    }
    throw e;
  }
}
