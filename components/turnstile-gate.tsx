"use client";

import { createContext, useContext, useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileContextValue = {
  getToken: () => string | null;
  isReady: boolean;
};

const TurnstileContext = createContext<TurnstileContextValue>({
  getToken: () => null,
  isReady: !SITE_KEY,
});

export function useTurnstile() {
  return useContext(TurnstileContext);
}

export function TurnstileGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const getToken = () => token;
  const isReady = !SITE_KEY || token !== null;

  return (
    <TurnstileContext.Provider value={{ getToken, isReady }}>
      {SITE_KEY && (
        <Turnstile
          ref={turnstileRef}
          siteKey={SITE_KEY}
          options={{ size: "invisible" }}
          onSuccess={setToken}
          onExpire={() => {
            setToken(null);
            turnstileRef.current?.reset();
          }}
        />
      )}
      {children}
    </TurnstileContext.Provider>
  );
}
