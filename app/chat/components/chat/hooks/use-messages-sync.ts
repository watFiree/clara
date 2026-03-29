import { useChatStore } from "@/lib/store/chat-store";
import { isConversationMessagesResponse } from "@/lib/types/api";
import { queryFactory } from "@/lib/queryFactory";
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
      try {
        const data = await queryFactory(
          `/api/conversations/${activeConversationId}/messages`,
          {},
          isConversationMessagesResponse,
        );
        return transformDbMessages(data.messages);
      } catch {
        return [];
      }
    },
    enabled: Boolean(activeConversationId) && !newChatPendingMessage,
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
