"use client";

import { BrainIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PromptInputActionMenuItem } from "@/components/ai-elements/prompt-input";
import { Switch } from "@/components/ui/switch";
import { useChatStore } from "@/lib/store/chat-store";
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
    queryFn: async () => {
      const res = await fetch(
        `/api/conversations/${activeConversationId}/settings`,
      );
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data: unknown = await res.json();
      if (!isConversationSettingsResponse(data))
        throw new Error("Invalid settings response");
      return data.settings;
    },
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
      if (!res.ok) throw new Error("Failed to update conversation settings");
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

  const handleToggle = (e: Event) => {
    e.preventDefault();
    if (activeConversationId) {
      toggleMutation.mutate();
    } else {
      setPendingMemoryDisabled(!pendingMemoryDisabled);
    }
  };

  return (
    <PromptInputActionMenuItem
      onSelect={handleToggle}
      disabled={toggleMutation.isPending}
    >
      <>
        <div className="flex items-center gap-2">
          <BrainIcon className="mr-2 size-4" />
          <span>Memory ({memoryDisabled ? "off" : "on"})</span>
        </div>
        <Switch
          size="sm"
          className="ml-auto"
          checked={!memoryDisabled}
          // onCheckedChange={handleToggle}
        />
      </>
    </PromptInputActionMenuItem>
  );
};
