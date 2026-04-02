"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CrownIcon, ExternalLinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { queryFactory } from "@/lib/queryFactory";
import { PLAN_ID, PlanSchema, type Plan } from "@/lib/stripe/plans";
import {
  isSubscriptionResponse,
  type SubscriptionResponse,
} from "@/lib/types/subscription";
import { isStripeUrlResponse } from "@/lib/types/stripe";


interface BillingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BillingDialog = ({ open, onOpenChange }: BillingDialogProps) => {
  const { data: subscription, isLoading } = useQuery<SubscriptionResponse>({
    queryKey: ["subscription"],
    queryFn: () => queryFactory("/api/subscription", {}, isSubscriptionResponse),
    enabled: open,
  });

  const { data: plans } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: () =>
      queryFactory("/api/plans", {}, PlanSchema.array()),
    enabled: open,
  });

  const plansMap = plans
    ? Object.fromEntries(plans.map((p) => [p.id, p]))
    : null;

  const handleManageBilling = async () => {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data: unknown = await res.json();
    if (isStripeUrlResponse(data) && data.url) window.location.href = data.url;
  };

  const handleUpgrade = (priceId: string) => {
    window.location.assign(`/api/stripe/checkout?priceId=${encodeURIComponent(priceId)}`);
  };

  const currentPlan = plansMap
    ? plansMap[subscription?.plan ?? PLAN_ID.free]
    : null;
  const percentage = subscription?.percentage ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Billing</DialogTitle>
          <DialogDescription>
            Manage your subscription and usage
          </DialogDescription>
        </DialogHeader>

        {isLoading || !plansMap ? (
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-lg bg-muted" />
            <div className="h-12 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Current plan */}
            <div className="rounded-lg border px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current plan</p>
                  <p className="text-lg font-semibold">
                    {currentPlan?.name ?? "Free"}
                  </p>
                </div>
                <Badge
                  variant={
                    subscription?.plan === PLAN_ID.free ? "outline" : "default"
                  }
                >
                  {subscription?.plan === PLAN_ID.free ? "Free" : "Active"}
                </Badge>
              </div>
            </div>

            {/* Usage */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Usage</span>
                <span>{percentage}%</span>
              </div>
              <Progress
                value={Math.min(percentage, 100)}
                className={
                  percentage >= 80
                    ? "[&>[data-slot=progress-indicator]]:bg-destructive"
                    : ""
                }
              />
              {percentage >= 80 && percentage < 100 && (
                <p className="text-xs text-destructive">
                  You&apos;re approaching your usage limit
                </p>
              )}
              {percentage >= 100 && (
                <p className="text-xs text-destructive font-medium">
                  Usage limit reached — upgrade to continue chatting
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {subscription?.plan === PLAN_ID.free &&
                plansMap[PLAN_ID.premium_lite] && (
                  <>
                    <Button
                      onClick={() =>
                        handleUpgrade(
                          plansMap[PLAN_ID.premium_lite]!.stripePriceId!
                        )
                      }
                    >
                      <CrownIcon className="size-4" />
                      Upgrade to {plansMap[PLAN_ID.premium_lite]!.name} — $
                      {(plansMap[PLAN_ID.premium_lite]!.price / 100).toFixed(0)}
                      /mo
                    </Button>
                    {plansMap[PLAN_ID.premium] && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleUpgrade(
                            plansMap[PLAN_ID.premium]!.stripePriceId!
                          )
                        }
                      >
                        <CrownIcon className="size-4" />
                        Upgrade to {plansMap[PLAN_ID.premium]!.name} — $
                        {(plansMap[PLAN_ID.premium]!.price / 100).toFixed(0)}/mo
                      </Button>
                    )}
                  </>
                )}
              {subscription?.plan === PLAN_ID.premium_lite &&
                plansMap[PLAN_ID.premium] && (
                  <Button
                    onClick={() =>
                      handleUpgrade(plansMap[PLAN_ID.premium]!.stripePriceId!)
                    }
                  >
                    <CrownIcon className="size-4" />
                    Upgrade to {plansMap[PLAN_ID.premium]!.name} — $
                    {(plansMap[PLAN_ID.premium]!.price / 100).toFixed(0)}/mo
                  </Button>
                )}
              {subscription?.plan !== "free" && (
                <Button variant="outline" onClick={handleManageBilling}>
                  <ExternalLinkIcon className="size-4" />
                  Manage subscription
                </Button>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/pricing" className="underline hover:text-foreground">
                Learn more about our plans
              </Link>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
