"use client";

import { BrandBubble } from "@/components/brand-logo";
import { RevealSection } from "@/components/reveal-section";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSetup } from "@/lib/hooks/use-setup";
import { motion } from "motion/react";

export function CtaSection() {
  const { setup, isSettingUp } = useSetup();

  return (
    <RevealSection className="py-28 sm:py-36">
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />

        <motion.div
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        >
          <BrandBubble className="mx-auto size-16" />
        </motion.div>

        <h2 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
          You deserve a moment for yourself
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-muted-foreground">
          No account, no commitment. Just a conversation whenever you need one.
        </p>
        <div className="mt-8">
          <Button
            onClick={() => setup()}
            disabled={isSettingUp}
            className="h-14 rounded-full px-10 text-base font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {isSettingUp ? <Spinner className="size-5" /> : "Start a session"}
          </Button>
        </div>
      </div>
    </RevealSection>
  );
}
