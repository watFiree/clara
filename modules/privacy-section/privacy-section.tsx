"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { privacyPoints } from "./consts";

export function PrivacySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  return (
    <section ref={ref} className="mx-auto max-w-5xl px-6 py-28 sm:py-36">
      <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:gap-20">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5 }}
          className="flex-1 text-center lg:text-left"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your data is yours <br />
            <Highlighter
              action="underline"
              color="#ffbc47"
              strokeWidth={3}
              isView={isInView}
              padding={4}
            >
              always
            </Highlighter>
            .
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            You shouldn&apos;t have to wonder who&apos;s reading your most
            honest thoughts. So we made sure nobody can.
          </p>
        </motion.div>

        {/* Right - points */}
        <div className="flex flex-1 flex-col gap-6">
          {privacyPoints.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
              className="flex items-start gap-4"
            >
              <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                <p.icon className="size-5" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
