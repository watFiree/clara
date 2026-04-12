import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { checkJournalAccess } from "@/lib/features/journal/checkAccess";
import { getMonthlyGenerationCount } from "@/lib/services/journal/service";

export async function GET() {
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

    const now = new Date();
    const count = await getMonthlyGenerationCount(
      user.id,
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
    );

    return NextResponse.json({
      monthlyGenerationLimit: access.monthlyGenerationLimit ?? -1,
      monthlyGenerationCount: count,
      canEdit: access.canEdit,
    });
  } catch (error) {
    console.error("Failed to check journal access:", error);
    return NextResponse.json(
      { error: "Failed to check journal access" },
      { status: 500 },
    );
  }
}
