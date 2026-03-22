import { NextResponse } from "next/server";

import { getOrCreateUser } from "@/lib/auth";
import { checkUsageLimit } from "@/lib/stripe/usage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getOrCreateUser();
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
