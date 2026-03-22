import { NextResponse } from "next/server";

import { getOrCreateUser } from "@/lib/auth";
import { getStripeServer } from "@/lib/stripe";

export async function POST() {
  try {
    const user = await getOrCreateUser();

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await getStripeServer().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/chat`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
