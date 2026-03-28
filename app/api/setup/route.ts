import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { COOKIE_NAME } from "@/config";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { assignAnonCookie } from "@/lib/middleware";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const cookieId = cookieStore.get(COOKIE_NAME)?.value;

    const body = await req.json();
    const fingerprint =
      typeof body.fingerprint === "string" ? body.fingerprint : null;

    if (!fingerprint) {
      return NextResponse.json(
        { error: "Fingerprint is required" },
        { status: 400 },
      );
    }

    if (!cookieId) {
      const newId = crypto.randomUUID();
      await prisma.user.create({ data: { id: newId, fingerprint } });
      const response = NextResponse.json({ status: "created", userId: newId });
      return assignAnonCookie(response, newId);
    }

    const user = await prisma.user.findUnique({
      where: { id: cookieId },
    });

    if (!user) {
      // Cookie is stale — try to reclaim by fingerprint or create new user
      const existingUser = await prisma.user.findFirst({
        where: { fingerprint },
      });

      if (existingUser) {
        const response = NextResponse.json({
          status: "reclaimed",
          userId: existingUser.id,
        });
        return assignAnonCookie(response, existingUser.id);
      }

      try {
        await prisma.user.create({ data: { id: cookieId, fingerprint } });
      } catch (e: unknown) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          // Race condition — user was already created
        } else {
          throw e;
        }
      }

      return NextResponse.json({ status: "created", userId: cookieId });
    }

    if (user.authProvider !== "local") {
      return NextResponse.json({ error: "Use login" }, { status: 403 });
    }

    return NextResponse.json({ status: "existing", userId: user.id });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
