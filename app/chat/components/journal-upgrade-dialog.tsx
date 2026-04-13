"use client";

import { useQuery } from "@tanstack/react-query";
import { CrownIcon } from "lucide-react";
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
import { isJournalAccessResponse } from "@/lib/types/journal";

interface JournalUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JournalUpgradeDialog = ({
  open,
  onOpenChange,
}: JournalUpgradeDialogProps) => {
  const { data: access } = useQuery({
    queryKey: ["journal-access"],
    queryFn: () =>
      queryFactory("/api/journal/access", {}, isJournalAccessResponse),
    enabled: open,
  });

  const { data: plans } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: () => queryFactory("/api/plans", {}, PlanSchema.array()),
    enabled: open,
  });

  const plansMap = plans
    ? Object.fromEntries(plans.map((p) => [p.id, p]))
    : null;

  const handleUpgrade = (priceId: string) => {
    window.location.assign(
      `/api/stripe/checkout?priceId=${encodeURIComponent(priceId)}`,
    );
  };

  const limit = access?.monthlyGenerationLimit ?? 0;
  const used = access?.monthlyGenerationCount ?? 0;
  const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade your Journal</DialogTitle>
          <DialogDescription>
            Unlock more journal features with an upgraded plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {limit > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Generations this month</span>
                <span className="font-medium">
                  {used}/{limit}
                </span>
              </div>
              <Progress
                value={Math.min(percentage, 100)}
                className={
                  percentage >= 80
                    ? "[&>[data-slot=progress-indicator]]:bg-destructive"
                    : ""
                }
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <p className="text-sm font-semibold">Premium Lite</p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                <li>30 journal generations/month</li>
                <li>Edit entries manually</li>
                <li>AI reads your journal for context</li>
              </ul>
              {plansMap?.[PLAN_ID.premium_lite]?.stripePriceId && (
                <Button
                  size="sm"
                  className="mt-2 h-7 w-full gap-1.5 text-xs"
                  onClick={() =>
                    handleUpgrade(plansMap[PLAN_ID.premium_lite]!.stripePriceId!)
                  }
                >
                  <CrownIcon className="size-3.5" />
                  Upgrade — ${(plansMap[PLAN_ID.premium_lite]!.price / 100).toFixed(0)}/mo
                </Button>
              )}
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="text-sm font-semibold">Premium</p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                <li>Unlimited journal generations</li>
                <li>All Premium Lite features</li>
                <li>AI writes journal entries for you</li>
              </ul>
              {plansMap?.[PLAN_ID.premium]?.stripePriceId && (
                <Button
                  size="sm"
                  className="mt-2 h-7 w-full gap-1.5 text-xs"
                  onClick={() =>
                    handleUpgrade(plansMap[PLAN_ID.premium]!.stripePriceId!)
                  }
                >
                  <CrownIcon className="size-3.5" />
                  Upgrade — ${(plansMap[PLAN_ID.premium]!.price / 100).toFixed(0)}/mo
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
