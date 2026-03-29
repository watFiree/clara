"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { TurnstileGate } from "@/components/turnstile-gate";

function handleUserNotFound(error: unknown) {
  if (
    error instanceof Error &&
    error.message.includes("USER_NOT_FOUND") &&
    window.location.pathname !== "/setup"
  ) {
    window.location.href = "/setup";
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (
                error instanceof Error &&
                error.message.includes("USER_NOT_FOUND")
              ) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            onError: handleUserNotFound,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TurnstileGate>{children}</TurnstileGate>
    </QueryClientProvider>
  );
}
