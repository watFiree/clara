"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { RevealSection } from "@/components/reveal-section";
import { values } from "./consts";

export function ValuesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });

  return (
    <RevealSection
      id="values"
      className="mx-auto max-w-5xl px-6 py-28 sm:py-36"
    >
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Built on what matters
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
        Every decision we make comes back to four core principles.
      </p>

      <div
        ref={ref}
        className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-6 sm:grid-rows-2"
      >
        {values.map((v, i) => {
          // Bento layout: first card spans 4 cols, second 2 cols, third 2 cols, fourth 4 cols
          const spanClass = [
            "sm:col-span-4",
            "sm:col-span-2",
            "sm:col-span-2",
            "sm:col-span-4",
          ][i];

          return (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                delay: i * 0.12,
                duration: 0.5,
                ease: "easeOut",
              }}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg ${spanClass}`}
            >
              {/* Subtle gradient accent */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at ${i % 2 === 0 ? "top left" : "bottom right"}, hsl(var(--primary) / 0.06), transparent 60%)`,
                }}
              />

              <div className="relative">
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <v.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </RevealSection>
  );
}
