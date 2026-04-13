"use client";

import { useState } from "react";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { type ChatStatus } from "ai";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { ChatSpeechInput } from "./chat-speech-input";
import { NotebookPenIcon } from "lucide-react";

import { PromptInputAttachmentsDisplay } from "../attachment-display";
import { MemoryToggle } from "./memory-toggle";
import { GenerateJournalDialog } from "./generate-journal-dialog";
import { UsageWarning } from "@/components/usage-warning";
import { isCloudMode } from "@/config";
import { useChatStore } from "@/lib/store/chat-store";

export const ChatInput = ({
  text,
  status,
  isSubmitDisabled,
  onSubmit,
  onTextChange,
  onTranscriptionChange,
}: {
  text: string;
  status: ChatStatus;
  isSubmitDisabled: boolean;
  onSubmit: (
    message: PromptInputMessage,
    metadata?: Record<string, unknown>,
  ) => void;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTranscriptionChange: (transcript: string) => void;
}) => {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);

  return (
    <div className="w-full relative p-4">
      {isCloudMode && <UsageWarning />}
      <PromptInput
        globalDrop
        multiple
        onSubmit={(e) => onSubmit(e)}
        className="**:data-[slot=input-group]:rounded-xl"
      >
        <PromptInputHeader>
          <PromptInputAttachmentsDisplay />
        </PromptInputHeader>
        <PromptInputBody>
          <PromptInputTextarea onChange={onTextChange} value={text} />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <MemoryToggle />
            {activeConversationId && (
              <PromptInputButton
                tooltip="Generate journal entry"
                onClick={() => setJournalDialogOpen(true)}
              >
                <NotebookPenIcon className="size-4" />
              </PromptInputButton>
            )}
            <ChatSpeechInput
              className="shrink-0"
              onTranscriptionChange={onTranscriptionChange}
              size="icon-sm"
              variant="ghost"
            />
          </PromptInputTools>
          <PromptInputSubmit disabled={isSubmitDisabled} status={status} />
        </PromptInputFooter>
      </PromptInput>

      {activeConversationId && (
        <GenerateJournalDialog
          open={journalDialogOpen}
          onOpenChange={setJournalDialogOpen}
          conversationId={activeConversationId}
        />
      )}
    </div>
  );
};
