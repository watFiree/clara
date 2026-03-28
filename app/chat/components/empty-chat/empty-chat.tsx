"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { BrandBubble } from "@/components/brand-logo";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { isUserSettingsResponse } from "@/lib/types/settings";
import {
  getWellbeingPrompts,
  getGreeting,
  type ResolvedWellbeingPrompt,
} from "./prompts";

const subscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

interface NewChatProps {
  onPromptSelect?: (message: string, promptId: string) => void;
}

export const EmptyChat = ({ onPromptSelect }: NewChatProps) => {
  const isMounted = useIsMounted();
  const [showRest, setShowRest] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data: unknown = await res.json();
      if (!isUserSettingsResponse(data))
        throw new Error("Invalid settings response");
      return data.settings;
    },
  });

  const lang = settings?.language ?? "en";

  const prompts = useMemo(
    () => (isMounted ? getWellbeingPrompts(lang) : []),
    [isMounted, lang],
  );

  const greeting = useMemo(
    () => (isMounted ? getGreeting(lang) : { title: "", subtitle: "" }),
    [isMounted, lang],
  );

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
            {greeting.title}
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
              {greeting.title}
            </TypingAnimation>
          </span>
        </h2>
        <motion.p
          className="max-w-sm text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={showRest ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {greeting.subtitle}
        </motion.p>
      </div>

      {prompts.length > 0 && (
        <div className="mt-2 flex w-full max-w-md flex-col gap-3">
          {prompts.map((prompt, index) => (
            <SuggestionCard
              key={prompt.id}
              prompt={prompt}
              index={index}
              show={showRest}
              onClick={() => onPromptSelect?.(prompt.message, prompt.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SuggestionCard = ({
  prompt,
  index,
  show,
  onClick,
}: {
  prompt: ResolvedWellbeingPrompt;
  index: number;
  show: boolean;
  onClick?: () => void;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 8 }}
    animate={show ? { opacity: 1, y: 0 } : {}}
    transition={{
      duration: 0.25,
      delay: 0.2 + index * 0.08,
    }}
    whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
    className="flex cursor-pointer flex-col gap-1.5 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
  >
    <div className="flex items-center gap-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <prompt.icon className="size-3.5" />
      </div>
      <span className="text-sm font-semibold text-foreground">
        {prompt.label}
      </span>
    </div>
    <p className="text-xs leading-relaxed text-muted-foreground">
      {prompt.description}
    </p>
  </motion.button>
);
