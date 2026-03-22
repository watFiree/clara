import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/lib/store/chat-store";
import { createConversationResponseSchema } from "@/lib/types/conversations";

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
    mutationFn: async (messageText: string) => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Creation failed");
      const data = await res.json();
      const parsed = await createConversationResponseSchema.parseAsync(data);

      if (pendingMemoryDisabled) {
        await fetch(`/api/conversations/${parsed.id}/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memoryDisabled: true }),
        });
      }

      return { id: parsed.id, messageText };
    },
    onSuccess: async ({ id, messageText }) => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      await queryClient.invalidateQueries({
        queryKey: ["conversation-settings", id],
      });
      setActiveConversationId(id);
      setNewChatPendingMessage(messageText);
    },
  });

  return { createConversation };
};
