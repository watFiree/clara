import { useChatStore } from "@/lib/store/chat-store";
import { isConversationMessagesResponse } from "@/lib/types/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UIMessage } from "ai";
import { useShallow } from "zustand/react/shallow";
import { transformDbMessages } from "../../../utils/transformDbMesssages";
import { useEffect, useRef } from "react";

export const useMessagesSync = ({
  setMessages,
}: {
  setMessages: (messages: UIMessage[]) => void;
}) => {
  const activeConversationId = useChatStore(
    useShallow((s) => s.activeConversationId),
  );
  const activeConversationRef = useRef<string | null>(null);
  const newChatPendingMessage = useChatStore(
    useShallow((s) => s.newChatPendingMessage),
  );
  const queryClient = useQueryClient();
  const { data: initialMessages = [], isLoading } = useQuery<UIMessage[]>({
    queryKey: ["conversation", activeConversationId, "messages"],
    queryFn: async () => {
      const res = await fetch(
        `/api/conversations/${activeConversationId}/messages`,
      );
      if (!res.ok) return [];
      const data: unknown = await res.json();
      if (!isConversationMessagesResponse(data)) return [];
      const messages = transformDbMessages(data.messages);
      return messages;
    },
    enabled: Boolean(activeConversationId) && !newChatPendingMessage.length,
  });

  useEffect(() => {
    if (activeConversationId !== activeConversationRef.current && !isLoading) {
      activeConversationRef.current = activeConversationId;
      setMessages(initialMessages);
    }
  }, [activeConversationId, initialMessages, setMessages, isLoading]);

  useEffect(() => {
    return () => {
      // TODO: invalidate only when current chat has received new messages
      queryClient.invalidateQueries({
        queryKey: ["conversation", activeConversationId, "messages"],
      });
    };
  }, [activeConversationId, queryClient]);

  return { isSyncing: isLoading };
};
