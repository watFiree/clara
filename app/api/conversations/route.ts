import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { isCloudMode } from "@/config";
import { ErrorFactory } from "@/lib/errors/errorFactory";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, updatedAt: true },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");
    if (user.authProvider === "local" && isCloudMode) {
      const conversationsCount = await prisma.conversation.count({
        where: { userId: user.id },
      });

      if (conversationsCount >= 3) {
        return ErrorFactory("CONVERSATIONS_LIMIT_REACHED");
      }
    }
    const id = nanoid();
    const title = `Session from ${new Date().toLocaleDateString()}`;
    await prisma.conversation.create({
      data: { id, title, userId: user.id },
    });
    return NextResponse.json({ id });
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 },
    );
  }
}
