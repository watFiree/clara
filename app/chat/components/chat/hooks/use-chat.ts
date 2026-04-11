import { useChatStore } from "@/lib/store/chat-store";
import { useChat as useChatBase } from "@ai-sdk/react";
import { useShallow } from "zustand/react/shallow";
import { useMessagesSync } from "./use-messages-sync";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useQueryClient } from "@tanstack/react-query";
import {
  isSaveMemoryToolPart,
  isUpdateMemoryToolPart,
} from "@/lib/tools/helpers";
import { useTurnstile } from "@/components/turnstile-gate";

export const useChat = () => {
  const activeConversationId = useChatStore(
    useShallow((s) => s.activeConversationId),
  );
  const queryClient = useQueryClient();
  const { getToken } = useTurnstile();

  const { messages, sendMessage, status, setMessages, addToolOutput } =
    useChatBase({
      id: activeConversationId ?? "",
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      transport: new DefaultChatTransport({
        api: "/api/chat",
        headers: {
          ...(getToken() ? { "x-turnstile-token": getToken() as string } : {}),
        },
      }),
      onError: async (error) => {
        if (error instanceof Error) {
          if (error.message.includes("USER_NOT_FOUND")) {
            window.location.href = "/setup";
            return;
          }
        }
      },
      onFinish: ({ message }) => {
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
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
