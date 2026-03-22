import { useChatStore } from "@/lib/store/chat-store";
import { useChat as useChatBase } from "@ai-sdk/react";
import { useShallow } from "zustand/react/shallow";
import { useMessagesSync } from "./use-messages-sync";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useQueryClient } from "@tanstack/react-query";
import {
  isSaveMemoryToolPart,
  isUpdateMemoryToolPart,
} from "@/lib/tools/helpers";

export const useChat = () => {
  const activeConversationId = useChatStore(
    useShallow((s) => s.activeConversationId),
  );
  const queryClient = useQueryClient();

  const { messages, sendMessage, status, setMessages, addToolOutput } =
    useChatBase({
      id: activeConversationId ?? "",
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      onFinish: ({ message }) => {
        const hasMemoryMutation = message.parts.some(
          (part) => isSaveMemoryToolPart(part) || isUpdateMemoryToolPart(part),
        );
        if (hasMemoryMutation) {
          queryClient.invalidateQueries({ queryKey: ["memories"] });
        }
      },
    });

  const { isSyncing } = useMessagesSync({ setMessages });

  return { messages, sendMessage, isSyncing, status, addToolOutput };
};
