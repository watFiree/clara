"use client";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { isCloudMode } from "@/config";
import { useHomepageStore } from "@/lib/store/homepage-store";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const animationPhase = useHomepageStore((s) => s.animationPhase);
  const [scrolled, setScrolled] = useState(false);

  const isVisible = animationPhase === "done";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <Link href="/">
        <BrandLogo />
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/pricing"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Pricing
        </Link>
        {isCloudMode ? (
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/chat">App</Link>
          </Button>
        )}
      </div>
    </motion.nav>
  );
}
