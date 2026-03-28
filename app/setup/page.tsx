"use client";

import { Spinner } from "@/components/ui/spinner";
import { useSetup } from "@/lib/hooks/use-setup";
import { useEffect, useRef } from "react";

export default function SetupPage() {
  const { setup } = useSetup();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    setup();
  }, [setup]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  );
}
