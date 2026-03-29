"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTurnstile } from "@/components/turnstile-gate";

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
  const { getToken } = useTurnstile();

  const {
    mutate: setup,
    isPending: isSettingUp,
    error,
    isError,
  } = useMutation({
    mutationFn: async () => {
      const fingerprint = await getFingerprint();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const turnstileToken = getToken();
      if (turnstileToken) {
        headers["x-turnstile-token"] = turnstileToken;
      }

      const res = await fetch("/api/setup", {
        method: "POST",
        headers,
        body: JSON.stringify({ fingerprint }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Use login") {
          router.push("/auth/login");
          return;
        }
        throw new Error(data.error || "Setup failed");
      }

      router.push("/chat");
    },
  });

  return { setup, isSettingUp, error, isError };
}
