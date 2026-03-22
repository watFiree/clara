import { handleAuth } from "@workos-inc/authkit-nextjs";

import { prisma } from "@/lib/prisma";

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
  },
});
