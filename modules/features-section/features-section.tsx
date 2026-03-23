"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { RevealSection } from "@/components/reveal-section";
import { features } from "./consts";

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.15, once: true });

  return (
    <RevealSection className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Built around you, not around metrics
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
        Every part of Clara exists to make reflection feel easy and natural.
      </p>

      <div
        ref={ref}
        className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              delay: i * 0.08,
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={`group relative overflow-hidden rounded-2xl border p-7 transition-all hover:shadow-lg ${
              feature.highlight
                ? "border-primary/30 bg-primary/[0.03] sm:col-span-2 lg:col-span-1 lg:row-span-2"
                : i === features.length - 1
                  ? "border-border bg-card lg:col-span-3"
                  : "border-border bg-card"
            }`}
          >
            <div className="relative">
              <div
                className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl transition-colors ${
                  feature.highlight
                    ? "bg-primary/15 text-primary group-hover:bg-primary/25"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                <feature.icon className="size-5" />
              </div>
              <h3
                className={`font-semibold ${feature.highlight ? "text-xl" : "text-lg"}`}
              >
                {feature.title}
              </h3>
              <p
                className={`mt-2 leading-relaxed text-muted-foreground ${feature.highlight ? "text-base" : "text-sm"}`}
              >
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </RevealSection>
  );
}
