import { cookies } from "next/headers";
import { withAuth } from "@workos-inc/authkit-nextjs";

import { prisma } from "@/lib/prisma";
import { isCloudMode, COOKIE_NAME } from "@/config";

export async function getUser() {
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

  if (!cookieId) return null;

  return prisma.user.findUnique({ where: { id: cookieId } });
}
