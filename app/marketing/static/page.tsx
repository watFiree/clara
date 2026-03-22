"use client";

import { BrandBubble } from "@/components/brand-logo";

export default function MarketingStaticPage() {
  return (
    <div
      id="capture"
      className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-background font-sans"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <BrandBubble className="size-28 sm:size-36" />

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl lg:text-9xl">
            <span className="text-foreground">Meet </span>
            <span>clara</span>
          </h1>

          <p className="mt-4 max-w-md text-lg text-muted-foreground sm:text-xl">
            Your personal wellbeing assistant
          </p>
        </div>
      </div>

      {/* Subtle bottom tagline */}
      <p className="absolute bottom-8 text-xs tracking-widest uppercase text-muted-foreground/50">
        Open source · Privacy-first · Made with care
      </p>
    </div>
  );
}
