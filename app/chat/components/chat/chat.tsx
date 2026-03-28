"use client";

import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { ChatInput } from "./chat-input";
import { MessageList } from "../message-list";
import { EmptyChat } from "../empty-chat/empty-chat";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/lib/store/chat-store";
import { useChat } from "./hooks/use-chat";
import { useNewConversation } from "./hooks/use-new-conversation";
import { LimitReachedDialog } from "./limit-reached-dialog";
import { isCloudMode } from "@/config";
import { ApiError } from "@/lib/errors";

export const Chat = () => {
  const activeConversationId = useChatStore(
    useShallow((s) => s.activeConversationId),
  );
  const newChatPendingMessage = useChatStore(
    useShallow((s) => s.newChatPendingMessage),
  );
  const setNewChatPendingMessage = useChatStore(
    useShallow((s) => s.setNewChatPendingMessage),
  );
  const { messages, sendMessage, status, isSyncing, addToolOutput } = useChat();
  const { createConversation } = useNewConversation();

  useEffect(() => {
    if (newChatPendingMessage) {
      sendMessage({
        text: newChatPendingMessage.text,
        ...(newChatPendingMessage.metadata && {
          metadata: newChatPendingMessage.metadata,
        }),
      });
      setNewChatPendingMessage(null);
    }
  }, [sendMessage, newChatPendingMessage, setNewChatPendingMessage]);

  const [text, setText] = useState("");
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [conversationLimitReached, setConversationLimitReached] =
    useState(false);

  const handleExistingConversationSubmit = (
    message: PromptInputMessage,
    metadata?: Record<string, unknown>,
  ) => {
    sendMessage({
      text: message.text,
      files: message.files,
      ...(metadata && { metadata }),
    });
    setText("");
  };

  const handleNewConversationSubmit = async (
    message: PromptInputMessage,
    metadata?: Record<string, unknown>,
  ) => {
    try {
      await createConversation.mutateAsync({ text: message.text, metadata });
      setText("");
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === "CONVERSATIONS_LIMIT_REACHED"
      ) {
        setLimitDialogOpen(true);
        setConversationLimitReached(true);
      } else {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (
    message: PromptInputMessage,
    metadata?: Record<string, unknown>,
  ) => {
    if (activeConversationId) {
      handleExistingConversationSubmit(message, metadata);
    } else {
      await handleNewConversationSubmit(message, metadata);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const text = value.trim().length > 0 ? value : "";
    setText(text);
  };

  const handleTranscriptionChange = (transcript: string) => {
    setText((prev) => prev + transcript);
  };

  const isSubmitDisabled =
    status === "submitted" ||
    status === "streaming" ||
    text.length === 0 ||
    isSyncing ||
    conversationLimitReached;

  return (
    <>
      {isCloudMode ? (
        <LimitReachedDialog
          open={limitDialogOpen}
          onOpenChange={setLimitDialogOpen}
        />
      ) : null}
      <div className="relative flex min-h-0 flex-1 flex-col rounded-xl bg-background shadow-sm">
        {messages.length > 0 ? (
          <MessageList
            messages={messages}
            status={status}
            addToolOutput={addToolOutput}
          />
        ) : (
          <EmptyChat
            onPromptSelect={(text, promptId) =>
              handleSubmit({ text, files: [] }, { promptId })
            }
          />
        )}
        <div className="shrink-0">
          <ChatInput
            isSubmitDisabled={isSubmitDisabled}
            onSubmit={handleSubmit}
            onTextChange={handleTextChange}
            onTranscriptionChange={handleTranscriptionChange}
            status={status}
            text={text}
          />
        </div>
      </div>
    </>
  );
};
