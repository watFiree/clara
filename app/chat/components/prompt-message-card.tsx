"use client";

import { useQuery } from "@tanstack/react-query";
import { queryFactory } from "@/lib/queryFactory";
import { isUserSettingsResponse } from "@/lib/types/settings";
import { getPromptById } from "./empty-chat/prompts";

export const PromptMessageCard = ({ promptId }: { promptId: string }) => {
  const { data: settings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () =>
      queryFactory("/api/settings", {}, isUserSettingsResponse).then(
        (d) => d.settings,
      ),
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
