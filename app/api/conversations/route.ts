import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";

export async function GET() {
  try {

    const user = await getOrCreateUser();

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

    const user = await getOrCreateUser();
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
