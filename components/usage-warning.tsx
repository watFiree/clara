"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BillingDialog } from "@/app/chat/components/billing-dialog";
import {
  isSubscriptionResponse,
  type SubscriptionResponse,
} from "@/lib/types/subscription";

export const UsageWarning = () => {
  const [billingOpen, setBillingOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { data: subscription } = useQuery<SubscriptionResponse>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscription");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: unknown = await res.json();
      if (!isSubscriptionResponse(data))
        throw new Error("Invalid subscription response");
      return data;
    },
    refetchInterval: 60_000,
  });

  if (!subscription) return null;

  const { percentage = 0, allowed = false } = subscription ?? {};

  if (percentage < 80) return null;
  if (dismissed && allowed) return null;

  return (
    <>
      <div className="flex items-center gap-2 rounded-sm border border-border bg-muted/50 px-2 mb-1 py-1.5 text-xs text-muted-foreground">
        <AlertTriangleIcon className="size-3 shrink-0" />
        <span className="flex-1">
          {!allowed
            ? "You've reached your usage limit. Upgrade to continue."
            : "Approaching your usage limit."}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="default"
            className="h-6 px-2 text-xs"
            onClick={() => setBillingOpen(true)}
          >
            Upgrade
          </Button>
          {allowed && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => setDismissed(true)}
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>
      <BillingDialog open={billingOpen} onOpenChange={setBillingOpen} />
    </>
  );
};
