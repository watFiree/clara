"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

async function getFingerprint(): Promise<string | null> {
  try {
    const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
    const agent = await FingerprintJS.load();
    const result = await agent.get();
    return result.visitorId;
  } catch {
    return null;
  }
}

export function useSetup() {
  const router = useRouter();

  const { mutate: setup, isPending: isSettingUp } = useMutation({
    mutationFn: async () => {
      const fingerprint = await getFingerprint();

      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint }),
      });

      const data = await res.json();

      if (!res.ok && data.error === "Use login") {
        router.push("/auth/login");
        return;
      }

      router.push("/chat");
    },
  });

  return { setup, isSettingUp };
}
