import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Attachment,
  AttachmentPreview,
} from "@/components/ai-elements/attachments";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { BrandBubble, UserBubble } from "@/components/brand-logo";
import type { UIMessage } from "@ai-sdk/react";
import { ChatStatus } from "ai";
import { AskQuestionsWizard } from "./ask-questions-wizard";
import { isAskQuestionsToolPart } from "@/lib/tools/ask-questions/helpers";
import type { AskQuestionsOutput } from "@/lib/tools/ask-questions/consts";
import {
  isSaveMemoryToolPart,
  isGetMemoriesToolPart,
  isUpdateMemoryToolPart,
  isReadJournalToolPart,
  isUpdateJournalToolPart,
} from "@/lib/tools/helpers";
import { SaveMemoryIndicator } from "./save-memory-indicator";
import { GetMemoriesIndicator } from "./get-memories-indicator";
import { UpdateMemoryIndicator } from "./update-memory-indicator";
import { ReadJournalIndicator } from "./read-journal-indicator";
import { UpdateJournalApproval } from "./update-journal-approval";
import type { UpdateJournalOutput } from "@/lib/tools/update-journal/consts";
import { PromptMessageCard } from "./prompt-message-card";

function hasPromptId(
  value: unknown,
): value is { promptId: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "promptId" in value &&
    typeof value.promptId === "string"
  );
}

type AddToolOutput = (args:
  | {
      tool: "askQuestions";
      toolCallId: string;
      output: AskQuestionsOutput;
    }
  | {
      tool: "updateJournal";
      toolCallId: string;
      output: UpdateJournalOutput;
    }
) => void;


const ThinkingIndicator = () => (
  <div className="flex items-end gap-2.5">
    <BrandBubble className="size-6" />
    <Message from="assistant">
      <MessageContent>
        <Shimmer as="span" className="text-sm">
          Analyzing...
        </Shimmer>
      </MessageContent>
    </Message>
  </div>
);

export const AssistantParts = ({
  message,
  isLastMessage,
  isStreaming,
  addToolOutput,
}: {
  message: UIMessage;
  isLastMessage: boolean;
  isStreaming: boolean;
  addToolOutput: AddToolOutput;
}) => {
  const lastPart = message.parts.at(-1);
  const isReasoningStreaming =
    isLastMessage && isStreaming && lastPart?.type === "reasoning";

  return (
    <>
      {isReasoningStreaming && (
        <Shimmer as="span" className="text-sm">
          Thinking...
        </Shimmer>
      )}
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <MessageResponse key={`${message.id}-${i}`}>
              {part.text}
            </MessageResponse>
          );
        }
        if (isSaveMemoryToolPart(part)) {
          return <SaveMemoryIndicator key={`${message.id}-${i}`} part={part} />;
        }
        if (isGetMemoriesToolPart(part)) {
          return <GetMemoriesIndicator key={`${message.id}-${i}`} part={part} />;
        }
        if (isUpdateMemoryToolPart(part)) {
          return <UpdateMemoryIndicator key={`${message.id}-${i}`} part={part} />;
        }
        if (isReadJournalToolPart(part)) {
          return <ReadJournalIndicator key={`${message.id}-${i}`} part={part} />;
        }
        if (isUpdateJournalToolPart(part)) {
          return (
            <UpdateJournalApproval
              key={`${message.id}-${i}`}
              toolCallId={part.toolCallId}
              input={part.input}
              state={part.state}
              output={part.output}
              addToolOutput={addToolOutput}
            />
          );
        }
        if (isAskQuestionsToolPart(part)) {
          return (
            <AskQuestionsWizard
              key={`${message.id}-${i}`}
              toolCallId={part.toolCallId}
              input={part.input}
              state={part.state}
              output={part.output}
              addToolOutput={addToolOutput}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export const MessageList = ({
  messages,
  status,
  addToolOutput,
}: {
  messages: UIMessage[];
  status: ChatStatus;
  addToolOutput: AddToolOutput;
}) => {
  return (
    <Conversation>
      <ConversationContent>
        {messages.map((message, index) =>
          message.role === "assistant" ? (
            <div key={message.id} className="flex items-end gap-2.5">
              <BrandBubble className="size-6 shrink-0" />
              <Message from={message.role}>
                <MessageContent>
                  <AssistantParts
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    isStreaming={status === "streaming"}
                    addToolOutput={addToolOutput}
                  />
                </MessageContent>
              </Message>
            </div>
          ) : (
            <div
              key={message.id}
              className="flex flex-row-reverse items-end gap-2.5"
            >
              <UserBubble className="size-6" />
              <Message from={message.role}>
                <MessageContent>
                  {hasPromptId(message.metadata) ? (
                    <PromptMessageCard
                      promptId={message.metadata.promptId}
                    />
                  ) : (
                    message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <MessageResponse key={index}>
                            {part.text}
                          </MessageResponse>
                        );
                      }

                      if (part.type === "file") {
                        return (
                          <Attachment
                            key={index}
                            data={{ ...part, id: String(index) }}
                          >
                            <AttachmentPreview />
                          </Attachment>
                        );
                      }
                      return null;
                    })
                  )}
                </MessageContent>
              </Message>
            </div>
          ),
        )}
        {status === "submitted" && <ThinkingIndicator />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};
