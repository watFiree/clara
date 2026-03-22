"use client";

import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { ChatInput } from "./chat-input";
import { MessageList } from "../message-list";
import { NewChat } from "../new-chat";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/lib/store/chat-store";
import { useChat } from "./hooks/use-chat";
import { useNewConversation } from "./hooks/use-new-conversation";

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
      sendMessage({ text: newChatPendingMessage });
      setNewChatPendingMessage("");
    }
  }, [sendMessage, newChatPendingMessage, setNewChatPendingMessage]);

  const [text, setText] = useState("");

  const handleExistingConversationSubmit = (message: PromptInputMessage) => {
    sendMessage({ text: message.text, files: message.files });
    setText("");
  };
  const handleNewConversationSubmit = async (message: PromptInputMessage) => {
    try {
      await createConversation.mutateAsync(message.text);
      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    if (activeConversationId) {
      handleExistingConversationSubmit(message);
    } else {
      await handleNewConversationSubmit(message);
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
    isSyncing;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col rounded-xl bg-background shadow-sm">
      {messages.length > 0 ? (
        <MessageList
          messages={messages}
          status={status}
          addToolOutput={addToolOutput}
        />
      ) : (
        <NewChat onPromptSelect={(text) => handleSubmit({ text, files: [] })} />
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
  );
};
