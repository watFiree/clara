import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripeServer() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Stripe features are unavailable.",
      );
    }
    stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  }
  return stripe;
}
