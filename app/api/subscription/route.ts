import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { checkUsageLimit } from "@/lib/stripe/usage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");
    const usage = await checkUsageLimit(user.id);

    return NextResponse.json({
      plan: usage.plan,
      percentage: Math.round(usage.percentage),
      allowed: usage.allowed,
    });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
