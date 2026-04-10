import { cookies } from "next/headers";
import { withAuth } from "@workos-inc/authkit-nextjs";

import { prisma } from "@/lib/prisma";
import { isCloudMode, COOKIE_NAME } from "@/config";

export async function getUser() {
  // Cloud mode: check WorkOS session first
  if (isCloudMode) {
    const { user: workosUser } = await withAuth();
    if (workosUser) {
      const existing = await prisma.user.findUnique({
        where: { providerId: workosUser.id },
      });
      if (existing) return existing;
      // Self-heal: WorkOS session is valid but the DB row is missing
      // (e.g. manually deleted, partial migration). Recreate it instead
      // of silently falling through to the anon-cookie path. upsert
      // avoids a P2002 race if two requests hit this branch at once.
      return prisma.user.upsert({
        where: { providerId: workosUser.id },
        create: { authProvider: "workos", providerId: workosUser.id },
        update: {},
      });
    }
    // No WorkOS session. Fall through to the anon-cookie path below —
    // unauthenticated users in cloud mode still use the anon cookie.
  }

  // Anonymous cookie (unauthenticated cloud mode, or local mode)
  const cookieStore = await cookies();
  const cookieId = cookieStore.get(COOKIE_NAME)?.value;

  if (!cookieId) return null;

  return prisma.user.findUnique({ where: { id: cookieId } });
}
