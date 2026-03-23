"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { RevealSection } from "@/components/reveal-section";
import { steps } from "./consts";

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });

  return (
    <RevealSection className="bg-muted/50 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
          Showing up for yourself doesn&apos;t have to be complicated.
        </p>

        <div ref={ref} className="relative mt-20">
          {/* Vertical connector line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="absolute left-6 top-0 bottom-0 hidden w-px origin-top bg-border sm:block md:left-1/2 md:-translate-x-px"
          />

          <div className="flex flex-col gap-16 sm:gap-20">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                  }
                  transition={{
                    delay: i * 0.25 + 0.3,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className={`relative flex flex-col items-start gap-6 sm:flex-row sm:items-center md:items-center ${
                    isEven
                      ? "md:flex-row"
                      : "md:flex-row-reverse md:text-right"
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1 pl-16 sm:pl-16 md:pl-0">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary/60">
                      Step {step.num}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Icon node on the line */}
                  <div className="absolute left-0 sm:left-0 md:relative md:left-auto">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{
                        delay: i * 0.25 + 0.4,
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="flex size-12 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm"
                    >
                      <step.icon className="size-5 text-primary" />
                    </motion.div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden flex-1 md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
