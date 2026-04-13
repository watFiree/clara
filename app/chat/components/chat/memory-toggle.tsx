"use client";

import { BrainIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PromptInputButton } from "@/components/ai-elements/prompt-input";
import { useChatStore } from "@/lib/store/chat-store";
import { ApiError } from "@/lib/errors";
import { queryFactory } from "@/lib/queryFactory";
import { isConversationSettingsResponse } from "@/lib/types/api";

export const MemoryToggle = () => {
  const queryClient = useQueryClient();
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const pendingMemoryDisabled = useChatStore((s) => s.pendingMemoryDisabled);
  const setPendingMemoryDisabled = useChatStore(
    (s) => s.setPendingMemoryDisabled,
  );

  const { data: settings } = useQuery({
    queryKey: ["conversation-settings", activeConversationId],
    queryFn: () =>
      queryFactory(
        `/api/conversations/${activeConversationId}/settings`,
        {},
        isConversationSettingsResponse,
      ).then((d) => d.settings),
    enabled: !!activeConversationId,
  });

  const memoryDisabled = activeConversationId
    ? (settings?.memoryDisabled ?? false)
    : pendingMemoryDisabled;

  const queryKey = ["conversation-settings", activeConversationId];

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `/api/conversations/${activeConversationId}/settings`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memoryDisabled: !memoryDisabled }),
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.error) throw new ApiError(body.error);
        throw new Error("Failed to update conversation settings");
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{ memoryDisabled: boolean }>(
        queryKey,
      );
      queryClient.setQueryData(
        queryKey,
        (old: Record<string, unknown> = {}) => ({
          ...old,
          memoryDisabled: !memoryDisabled,
        }),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleToggle = () => {
    if (activeConversationId) {
      toggleMutation.mutate();
    } else {
      setPendingMemoryDisabled(!pendingMemoryDisabled);
    }
  };

  return (
    <PromptInputButton
      tooltip={`Memory (${memoryDisabled ? "off" : "on"})`}
      onClick={handleToggle}
      disabled={toggleMutation.isPending}
      className={memoryDisabled ? "text-muted-foreground" : ""}
    >
      <span className="relative">
        <BrainIcon className="size-4" />
        {memoryDisabled && (
          <svg
            className="absolute inset-0 size-4"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <line
              x1="2"
              y1="14"
              x2="14"
              y2="2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </PromptInputButton>
  );
};
