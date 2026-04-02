"use client";

import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Plan } from "@/lib/stripe/plans";
import Link from "next/link";

interface PricingCardsProps {
  plans: Plan[];
  isLocalUser: boolean;
}

export function PricingCards({ plans, isLocalUser }: PricingCardsProps) {
  const handleCta = (priceId: string) => {
    if (isLocalUser) {
      const returnTo = `/api/stripe/checkout?priceId=${encodeURIComponent(priceId)}`;
      window.location.assign(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
    } else {
      window.location.assign(`/api/stripe/checkout?priceId=${encodeURIComponent(priceId)}`);
    }
  };

  return (
    <div className="mt-12 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={
            plan.highlighted ? "relative border-primary shadow-lg" : "relative"
          }
        >
          {plan.highlighted && (
            <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
              Most popular
            </Badge>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription className="min-h-[2.5rem]">
              {plan.description}
            </CardDescription>
            <div className="pt-2">
              <span className="text-3xl font-bold">
                {plan.price === 0
                  ? "Free"
                  : `$${(plan.price / 100).toFixed(0)}`}
              </span>
              {plan.price > 0 && (
                <span className="text-muted-foreground">/mo</span>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <ul className="space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            {plan.stripePriceId ? (
              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
                onClick={() => handleCta(plan.stripePriceId!)}
              >
                Get {plan.name}
              </Button>
            ) : (
              <Button className="w-full" variant="outline" asChild>
                <Link href="/chat">Get started</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
