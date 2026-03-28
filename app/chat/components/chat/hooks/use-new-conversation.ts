import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useChatStore, type PendingMessage } from "@/lib/store/chat-store";
import { createConversationResponseSchema } from "@/lib/types/conversations";
import { ApiError } from "@/lib/errors";

export const useNewConversation = () => {
  const queryClient = useQueryClient();
  const setActiveConversationId = useChatStore(
    useShallow((s) => s.setActiveConversationId),
  );
  const setNewChatPendingMessage = useChatStore(
    useShallow((s) => s.setNewChatPendingMessage),
  );
  const pendingMemoryDisabled = useChatStore((s) => s.pendingMemoryDisabled);

  const createConversation = useMutation({
    mutationFn: async (pending: PendingMessage) => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.error) throw new ApiError(body.error);
        throw new Error("Creation failed");
      }
      const data = await res.json();
      const parsed = await createConversationResponseSchema.parseAsync(data);

      if (pendingMemoryDisabled) {
        await fetch(`/api/conversations/${parsed.id}/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memoryDisabled: true }),
        });
      }

      return { id: parsed.id, pending };
    },
    onSuccess: async ({ id, pending }) => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      await queryClient.invalidateQueries({
        queryKey: ["conversation-settings", id],
      });
      setActiveConversationId(id);
      setNewChatPendingMessage(pending);
    },
  });

  return { createConversation };
};
