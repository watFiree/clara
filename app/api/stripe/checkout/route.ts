import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { prisma } from "@/lib/prisma";
import { getStripeServer } from "@/lib/stripe";

async function createCheckoutSession(priceId: string) {
  const user = await getUser();
  if (!user) return { error: ErrorFactory("USER_NOT_FOUND") };

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

  return { url: session.url };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const priceId = searchParams.get("priceId");

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 },
      );
    }

    const result = await createCheckoutSession(priceId);
    if ("error" in result) return result.error;
    if (result.url) return NextResponse.redirect(result.url);

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("priceId" in body) ||
      typeof body.priceId !== "string"
    ) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 },
      );
    }

    const result = await createCheckoutSession(body.priceId);
    if ("error" in result) return result.error;

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
