import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { checkMemoryAccess } from "@/lib/features/memories/checkAccess";
import { getMemoriesByUser } from "@/lib/services/memory/service";

export async function GET() {
  try {
    const user = await getOrCreateUser();

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
