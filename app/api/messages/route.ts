import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createMessage } from "@/lib/services/message-service";
import { isCreateMessageBody } from "@/lib/types/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!isCreateMessageBody(body)) {
      return NextResponse.json(
        { error: "Invalid message data" },
        { status: 400 },
      );
    }

    const { id, role, parts, conversationId } = body;

    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      select: { userId: true },
    });

    const message = await createMessage(conversation.userId, {
      id,
      role,
      parts,
      conversationId,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Failed to save message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 },
    );
  }
}
