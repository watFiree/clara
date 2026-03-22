import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { getStripeServer } from "@/lib/stripe";
import { PLAN_ID } from "@/lib/stripe/plans";
import { getPlanById, getPlanByPriceId } from "@/lib/stripe/helpers";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripeServer().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
    }
  } catch (err) {
    console.error(`Webhook handler failed for ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

function getSubscriptionPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    start: new Date(item.current_period_start * 1000),
    end: new Date(item.current_period_end * 1000),
  };
}

function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer,
): string {
  return typeof customer === "string" ? customer : customer.id;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {

  const userId = session.client_reference_id;
  if (!userId) return;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
  if (!subscriptionId) return;

  const stripeSubscription =
    await getStripeServer().subscriptions.retrieve(subscriptionId);
  const priceId = stripeSubscription.items.data[0]?.price.id;
  const plan = await getPlanByPriceId(priceId);
  const fallbackPlan = plan ?? (await getPlanById(PLAN_ID.premium_lite));
  const period = getSubscriptionPeriod(stripeSubscription);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      status: stripeSubscription.status,
      plan: plan?.id ?? PLAN_ID.premium_lite,
      tokenLimit: fallbackPlan?.tokenLimit ?? 500_000,
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
    },
    update: {
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      status: stripeSubscription.status,
      plan: plan?.id ?? PLAN_ID.premium_lite,
      tokenLimit: fallbackPlan?.tokenLimit ?? 500_000,
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {

  const customerId = getCustomerId(subscription.customer);

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  });
  if (!user) return;

  const priceId = subscription.items.data[0]?.price.id;
  const plan = await getPlanByPriceId(priceId);
  const fallbackPlan = plan ?? (await getPlanById(PLAN_ID.premium_lite));
  const period = getSubscriptionPeriod(subscription);

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status: subscription.status,
      plan: plan?.id ?? PLAN_ID.premium_lite,
      tokenLimit: fallbackPlan?.tokenLimit ?? 500_000,
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
    },
    update: {
      stripePriceId: priceId,
      status: subscription.status,
      plan: plan?.id ?? PLAN_ID.premium_lite,
      tokenLimit: fallbackPlan?.tokenLimit ?? 500_000,
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {

  const customerId = getCustomerId(subscription.customer);

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  });
  if (!user) return;

  await prisma.subscription.update({
    where: { userId: user.id },
    data: { status: "canceled" },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {

  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;
  if (!customerId) return;

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  });
  if (!user) return;

  // In newer Stripe API, subscription is under parent.subscription_details
  const subscriptionId =
    invoice.parent?.subscription_details?.subscription ?? null;
  if (!subscriptionId) return;

  const subId =
    typeof subscriptionId === "string" ? subscriptionId : subscriptionId.id;

  const stripeSubscription =
    await getStripeServer().subscriptions.retrieve(subId);
  const period = getSubscriptionPeriod(stripeSubscription);

  await prisma.subscription.update({
    where: { userId: user.id },
    data: {
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
    },
  });
}
