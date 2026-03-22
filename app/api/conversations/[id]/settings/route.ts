import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { isConversationSettingsBody } from "@/lib/types/api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getOrCreateUser();
    const { id } = await params;

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.id },
      select: { settings: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      settings: conversation.settings ?? { memoryDisabled: false },
    });
  } catch (error) {
    console.error("Failed to fetch conversation settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getOrCreateUser();
    const { id } = await params;
    const body = await req.json();

    if (!isConversationSettingsBody(body)) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const settings = await prisma.conversationSettings.upsert({
      where: { conversationId: id },
      create: {
        conversationId: id,
        memoryDisabled: body.memoryDisabled ?? false,
      },
      update: {
        ...(body.memoryDisabled !== undefined && {
          memoryDisabled: body.memoryDisabled,
        }),
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to update conversation settings:", error);
    return NextResponse.json(
      { error: "Failed to update conversation settings" },
      { status: 500 },
    );
  }
}
