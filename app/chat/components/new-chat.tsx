"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { BrandBubble } from "@/components/brand-logo";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { getWellbeingPrompts } from "@/lib/wellbeing-prompts";

const subscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

interface NewChatProps {
  onPromptSelect?: (message: string) => void;
}

export const NewChat = ({ onPromptSelect }: NewChatProps) => {
  const isMounted = useIsMounted();
  const [showRest, setShowRest] = useState(false);
  const prompts = useMemo(
    () => (isMounted ? getWellbeingPrompts() : []),
    [isMounted],
  );

  // Show the rest after typing finishes: delay (600ms) + ~15 chars * 80ms ≈ 1800ms
  useEffect(() => {
    const timer = setTimeout(() => setShowRest(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      {/* Bubble with bounce like hero */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
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
            duration: 2.5,
            ease: "easeInOut",
            delay: 1.2,
          }}
        >
          <BrandBubble className="size-16" />
        </motion.div>
      </motion.div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="relative text-2xl font-bold tracking-tight">
          <span className="invisible" aria-hidden="true">
            Hey, I&apos;m Clara
          </span>
          <span className="absolute inset-0">
            <TypingAnimation
              className="leading-tight"
              delay={750}
              duration={80}
              startOnView={false}
              showCursor={false}
              as="span"
            >
              Hey, I&apos;m Clara
            </TypingAnimation>
          </span>
        </h2>
        <motion.p
          className="max-w-sm text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={showRest ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          Your personal wellbeing assistant. I&apos;m here whenever you&apos;d
          like to check in, reflect, or just talk.
        </motion.p>
      </div>

      {prompts.length > 0 && (
        <motion.div
          className="mt-2 grid w-full max-w-md grid-cols-3 gap-3"
          initial={{ opacity: 0 }}
          animate={showRest ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {prompts.map((prompt) => (
            <SuggestionCard
              key={prompt.message}
              icon={<prompt.icon className="size-4" />}
              label={prompt.label}
              onClick={() => onPromptSelect?.(prompt.message)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const SuggestionCard = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-border/60 bg-muted/50 px-3 py-4 text-center text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
  >
    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {icon}
    </div>
    {label}
  </button>
);
