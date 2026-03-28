"use client";

import { BrandBubble } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useHomepageStore } from "@/lib/store/homepage-store";
import { ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { animationConfig } from "./consts";
import { isCloudMode } from "@/config";
import { useSetup } from "@/lib/hooks/use-setup";
import { Spinner } from "@/components/ui/spinner";

export function Hero() {
  const { setup, isSettingUp } = useSetup();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, -80]);
  const discoverOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const animationPhase = useHomepageStore((s) => s.animationPhase);
  const setAnimationPhase = useHomepageStore((s) => s.setAnimationPhase);

  useEffect(() => {
    if (animationPhase === "done") {
      return;
    }

    const nextAnimation = animationConfig[animationPhase];

    const timeout = setTimeout(
      () => setAnimationPhase(nextAnimation.nextPhase),
      nextAnimation.delay,
    );
    return () => clearTimeout(timeout);
  }, [animationPhase, setAnimationPhase]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 will-change-[opacity]"
        style={{ opacity }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary) 20%, transparent) 0%, transparent 75%)",
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 will-change-[transform,opacity]"
        style={{ opacity, y }}
      >
        <motion.div
          initial={{ y: -400, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            y: {
              type: "spring",
              stiffness: 200,
              damping: 12,
              mass: 1.2,
              delay: 0.2,
            },
            opacity: { duration: 0.3, delay: 0.2 },
          }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
              delay: 1.8,
            }}
          >
            <BrandBubble className="size-20 sm:size-28" />
          </motion.div>
        </motion.div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="relative text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            <span className="invisible" aria-hidden>
              Meet clara
            </span>

            <span className="absolute inset-0 flex items-center justify-center">
              {animationPhase === "meet" && (
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

              {animationPhase === "pause" && (
                <span className="text-foreground">
                  Meet
                  <span className="inline-block animate-blink-cursor ml-0.5">
                    |
                  </span>
                </span>
              )}

              {(animationPhase === "clara" || animationPhase === "done") && (
                <span>
                  <span className="text-foreground">Meet </span>
                  {animationPhase === "clara" ? (
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
            </span>
          </h1>

          {/* Subtitle — always in DOM, animated via opacity/y */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={
              animationPhase === "done"
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 16 }
            }
            transition={{
              delay: animationPhase === "done" ? 1.2 : 0,
              duration: 0.6,
            }}
            className="mt-4 max-w-md text-lg text-muted-foreground sm:text-xl"
          >
            A quiet space to check in with how you&apos;re really doing
          </motion.p>
        </div>

        {/* CTA buttons — always in DOM, animated via opacity/y */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            animationPhase === "done"
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{
            delay: animationPhase === "done" ? 1.4 : 0,
            duration: 0.5,
          }}
          className="mt-2 flex gap-4"
          style={{ pointerEvents: animationPhase === "done" ? "auto" : "none" }}
        >
          <Button
            onClick={() => setup()}
            disabled={isSettingUp}
            className="h-12 rounded-full px-8 text-sm font-semibold shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {isSettingUp ? (
              <Spinner className="size-5" />
            ) : isCloudMode ? (
              "Try for free"
            ) : (
              "Open app"
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full px-8 text-sm font-semibold"
          >
            <Link href="#values">Learn more</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Discover indicator - fades out on scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{ opacity: discoverOpacity }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-muted-foreground will-change-[opacity]"
      >
        <span className="text-xs tracking-widest uppercase">Discover</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="size-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
