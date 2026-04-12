import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { checkJournalAccess } from "@/lib/features/journal/checkAccess";
import {
  getJournalEntry,
  deleteJournalEntry,
} from "@/lib/services/journal/service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  try {
    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");

    const access = await checkJournalAccess(user.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason, upgrade: true },
        { status: 403 },
      );
    }

    const { date } = await params;
    const entry = await getJournalEntry(user.id, new Date(date));

    if (!entry) {
      return NextResponse.json({ entry: null });
    }

    return NextResponse.json({
      entry: {
        id: entry.id,
        date: entry.date.toISOString(),
        content: entry.content,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to fetch journal entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entry" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  try {
    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");

    const access = await checkJournalAccess(user.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason, upgrade: true },
        { status: 403 },
      );
    }

    const { date } = await params;
    await deleteJournalEntry(user.id, new Date(date));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete journal entry:", error);
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 },
    );
  }
}
