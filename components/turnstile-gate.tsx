"use client";

import { createContext, useContext, useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

type TurnstileContextValue = {
  getToken: () => string | null;
};

const TurnstileContext = createContext<TurnstileContextValue>({
  getToken: () => null,
});

export function useTurnstile() {
  return useContext(TurnstileContext);
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function TurnstileGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const getToken = () => token;

  return (
    <TurnstileContext.Provider value={{ getToken }}>
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
