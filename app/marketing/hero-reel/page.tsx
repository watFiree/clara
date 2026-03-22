"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BrandBubble } from "@/components/brand-logo";
import { TypingAnimation } from "@/components/ui/typing-animation";

export default function HeroReelPage() {
  const [phase, setPhase] = useState<
    "wait" | "landing" | "meet" | "pause" | "clara" | "done"
  >("wait");

  useEffect(() => {
    // Small initial delay so the recording can start on a clean frame
    const t = setTimeout(() => setPhase("landing"), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "landing") {
      const t = setTimeout(() => setPhase("meet"), 1400);
      return () => clearTimeout(t);
    }
    if (phase === "meet") {
      const t = setTimeout(() => setPhase("pause"), 750);
      return () => clearTimeout(t);
    }
    if (phase === "pause") {
      const t = setTimeout(() => setPhase("clara"), 2000);
      return () => clearTimeout(t);
    }
    if (phase === "clara") {
      const t = setTimeout(() => setPhase("done"), 900);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const showOrb = phase !== "wait";

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-background font-sans">
      {/* Ambient glow — fades in with orb */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showOrb ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px]" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Orb — drops from top and bounces */}
        {showOrb && (
          <motion.div
            initial={{ y: -500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              y: {
                type: "spring",
                stiffness: 200,
                damping: 12,
                mass: 1.2,
              },
              opacity: { duration: 0.3 },
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
                delay: 1.2,
              }}
            >
              <BrandBubble className="size-24 sm:size-32" />
            </motion.div>
          </motion.div>
        )}

        {/* Typing headline */}
        <div className="flex flex-col items-center gap-2 text-center min-h-[1em]">
          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl lg:text-9xl">
            {phase === "wait" && <span className="invisible">Meet clara</span>}
            {phase === "landing" && (
              <span className="invisible">Meet clara</span>
            )}

            {phase === "meet" && (
              <TypingAnimation
                typeSpeed={140}
                startOnView={false}
                showCursor
                cursorStyle="line"
                className="text-foreground"
                as="span"
              >
                Meet
              </TypingAnimation>
            )}

            {phase === "pause" && (
              <span className="text-foreground">
                Meet
                <span className="inline-block animate-blink-cursor ml-0.5">
                  |
                </span>
              </span>
            )}

            {(phase === "clara" || phase === "done") && (
              <span>
                <span className="text-foreground">Meet </span>
                {phase === "clara" ? (
                  <TypingAnimation
                    typeSpeed={140}
                    startOnView={false}
                    showCursor
                    cursorStyle="line"
                    as="span"
                  >
                    clara
                  </TypingAnimation>
                ) : (
                  <span>clara</span>
                )}
              </span>
            )}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={
              phase === "done" ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
            }
            transition={{ delay: phase === "done" ? 0.8 : 0, duration: 0.6 }}
            className="mt-4 max-w-md text-lg text-muted-foreground sm:text-xl"
          >
            Your personal wellbeing assistant
          </motion.p>
        </div>
      </div>
    </div>
  );
}
