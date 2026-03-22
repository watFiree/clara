"use client";

import { BrandBubble } from "@/components/brand-logo";
import { RevealSection } from "@/components/reveal-section";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

export function CtaSection() {
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
          Ready to check in with yourself?
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-muted-foreground">
          It only takes a moment. No account needed - just start talking.
        </p>
        <div className="mt-8">
          <Button
            asChild
            className="h-14 rounded-full px-10 text-base font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Link href="/chat">Start a session</Link>
          </Button>
        </div>
      </div>
    </RevealSection>
  );
}
