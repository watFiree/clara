import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { prisma } from "@/lib/prisma";
import { getStripeServer } from "@/lib/stripe";

function isCheckoutBody(data: unknown): data is { priceId: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "priceId" in data &&
    typeof data.priceId === "string"
  );
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");
    const body = await req.json();

    if (!isCheckoutBody(body)) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 },
      );
    }

    const { priceId } = body;

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await getStripeServer().customers.create({
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await getStripeServer().checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/chat?billing=success`,
      cancel_url: `${appUrl}/chat?billing=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
