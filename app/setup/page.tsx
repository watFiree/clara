"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSetup } from "@/lib/hooks/use-setup";
import { useEffect, useRef } from "react";

export default function SetupPage() {
  const { setup, isSettingUp, isError, error } = useSetup();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    setup();
  }, [setup]);

  function handleRetry() {
    if (isSettingUp) return;
    setup();
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">
          {error?.message || "Something went wrong during setup."}
        </p>
        <Button onClick={handleRetry} disabled={isSettingUp} variant="outline">
          {isSettingUp ? "Retrying…" : "Try again"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  );
}
