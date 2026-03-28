"use client";

import { useQuery } from "@tanstack/react-query";
import { isUserSettingsResponse } from "@/lib/types/settings";
import { getPromptById } from "./empty-chat/prompts";

export const PromptMessageCard = ({ promptId }: { promptId: string }) => {
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
  const prompt = getPromptById(promptId, lang);

  if (!prompt) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 shrink-0 items-center bg-primary-foreground/10 justify-center rounded-lg ">
        <prompt.icon className="size-3.5  text-primary-foreground" />
      </div>
      <span className="text-sm font-medium">{prompt.label}</span>
    </div>
  );
};
