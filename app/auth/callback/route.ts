import { cookies } from "next/headers";
import { handleAuth } from "@workos-inc/authkit-nextjs";

import { prisma } from "@/lib/prisma";
import { COOKIE_NAME } from "@/config";

export const GET = handleAuth({
  returnPathname: "/chat",
  onSuccess: async ({ user, state }) => {
    const workosUser = await prisma.user.upsert({
      where: { providerId: user.id },
      create: { authProvider: "workos", providerId: user.id },
      update: {},
    });

    // Merge anonymous user data if state contains anonId
    if (state) {
      const { anonId } = JSON.parse(state);
      if (anonId && typeof anonId === "string" && anonId !== workosUser.id) {
        const anonUser = await prisma.user.findUnique({
          where: { id: anonId },
        });

        if (anonUser && anonUser.authProvider === "local") {
          await prisma.$transaction(async (tx) => {
            await tx.conversation.updateMany({
              where: { userId: anonId },
              data: { userId: workosUser.id },
            });

            await tx.usage.updateMany({
              where: { userId: anonId },
              data: { userId: workosUser.id },
            });
            const existingSettings = await tx.userSettings.findUnique({
              where: { userId: workosUser.id },
            });
            if (!existingSettings) {
              await tx.userSettings.updateMany({
                where: { userId: anonId },
                data: { userId: workosUser.id },
              });
            }

            await tx.user.delete({ where: { id: anonId } });
          });
        }
      }
    }

    // The anon cookie now points to a deleted (or unrelated) user row.
    // Clear it so getUser()'s fallback path can't hit a stale ID if the
    // WorkOS session ever returns null on a later request.
    (await cookies()).delete(COOKIE_NAME);
  },
});
