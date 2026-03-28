import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { checkMemoryAccess } from "@/lib/features/memories/checkAccess";
import { getMemoriesByUser } from "@/lib/services/memory/service";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");

    const access = await checkMemoryAccess(user.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason, upgrade: true },
        { status: 403 },
      );
    }

    const memories = await getMemoriesByUser(user.id);
    return NextResponse.json({ memories });
  } catch (error) {
    console.error("Failed to fetch memories:", error);
    return NextResponse.json(
      { error: "Failed to fetch memories" },
      { status: 500 },
    );
  }
}
