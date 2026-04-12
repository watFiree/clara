import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { checkJournalAccess } from "@/lib/features/journal/checkAccess";
import {
  getJournalEntryDates,
  upsertJournalEntry,
} from "@/lib/services/journal/service";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Invalid year or month" },
        { status: 400 },
      );
    }

    const dates = await getJournalEntryDates(user.id, year, month);
    return NextResponse.json({
      dates: dates.map((d) => d.toISOString()),
    });
  } catch (error) {
    console.error("Failed to fetch journal dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal dates" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const { date, content } = body;

    if (typeof date !== "string" || typeof content !== "string") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const entry = await upsertJournalEntry(user.id, new Date(date), content);

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
    console.error("Failed to save journal entry:", error);
    return NextResponse.json(
      { error: "Failed to save journal entry" },
      { status: 500 },
    );
  }
}
