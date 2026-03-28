import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { isRenameConversationBody } from "@/lib/types/api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {

    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");
    const { id } = await params;

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Failed to fetch conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {

    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");
    const { id } = await params;
    const body = await req.json();

    if (!isRenameConversationBody(body)) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 },
      );
    }

    const { title } = body;

    const conversation = await prisma.conversation.updateMany({
      where: { id, userId: user.id },
      data: { title },
    });

    if (conversation.count === 0) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to rename conversation:", error);
    return NextResponse.json(
      { error: "Failed to rename conversation" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {

    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");
    const { id } = await params;

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    await prisma.conversation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 },
    );
  }
}
