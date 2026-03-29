import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { checkMemoryAccess } from "@/lib/features/memories/checkAccess";
import {
  deleteMemory,
  updateMemory,
} from "@/lib/services/memory/service";
import type { MemoryStatus } from "@/app/generated/prisma/client";
import { isUpdateMemoryBody } from "@/lib/types/memory";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");
    const { id } = await params;

    const access = await checkMemoryAccess(user.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason, upgrade: true },
        { status: 403 },
      );
    }

    await deleteMemory(user.id, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete memory:", error);
    return NextResponse.json(
      { error: "Failed to delete memory" },
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

    const access = await checkMemoryAccess(user.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason, upgrade: true },
        { status: 403 },
      );
    }

    const body = await req.json();

    if (!isUpdateMemoryBody(body)) {
      return NextResponse.json(
        { error: "Invalid memory update data" },
        { status: 400 },
      );
    }

    const update: { status?: MemoryStatus; confidence?: number } = {};
    if (body.status) update.status = body.status;
    if (body.confidence !== undefined) update.confidence = body.confidence;

    await updateMemory(user.id, id, update);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update memory:", error);
    return NextResponse.json(
      { error: "Failed to update memory" },
      { status: 500 },
    );
  }
}
