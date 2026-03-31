"use client";

import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { type ChatStatus } from "ai";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { SpeechInput } from "@/components/ai-elements/speech-input";

import { PromptInputAttachmentsDisplay } from "../attachment-display";
import { MemoryToggle } from "./memory-toggle";
import { UsageWarning } from "@/components/usage-warning";
import { isCloudMode } from "@/config";

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
                <MemoryToggle />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <SpeechInput
              className="shrink-0"
              onTranscriptionChange={onTranscriptionChange}
              size="icon-sm"
              variant="ghost"
            />
          </PromptInputTools>
          <PromptInputSubmit disabled={isSubmitDisabled} status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};
