import type { UIMessage } from "ai";

export type RenameConversationBody = {
  title: string;
};

export function isRenameConversationBody(
  data: unknown,
): data is RenameConversationBody {
  return (
    typeof data === "object" &&
    data !== null &&
    "title" in data &&
    typeof data.title === "string"
  );
}

const VALID_MESSAGE_ROLES: readonly string[] = ["USER", "ASSISTANT"];

export type CreateMessageBody = {
  id: string;
  role: "USER" | "ASSISTANT";
  parts: unknown;
  conversationId: string;
};

export function isCreateMessageBody(
  data: unknown,
): data is CreateMessageBody {
  if (typeof data !== "object" || data === null) return false;
  return (
    "id" in data &&
    typeof data.id === "string" &&
    "role" in data &&
    typeof data.role === "string" &&
    VALID_MESSAGE_ROLES.includes(data.role) &&
    "parts" in data &&
    "conversationId" in data &&
    typeof data.conversationId === "string"
  );
}

export type ChatRequestBody = {
  messages: UIMessage[];
  id: string;
};

export function isChatRequestBody(
  data: unknown,
): data is ChatRequestBody {
  return (
    typeof data === "object" &&
    data !== null &&
    "messages" in data &&
    Array.isArray(data.messages) &&
    "id" in data &&
    typeof data.id === "string"
  );
}

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

export type ConversationsListResponse = {
  conversations: ConversationSummary[];
};

export function isConversationsListResponse(
  data: unknown,
): data is ConversationsListResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "conversations" in data &&
    Array.isArray(data.conversations)
  );
}

export type ConversationDetail = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ConversationDetailResponse = {
  conversation: ConversationDetail;
};

export function isConversationDetailResponse(
  data: unknown,
): data is ConversationDetailResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "conversation" in data &&
    typeof data.conversation === "object"
  );
}

export type CreateConversationResponse = {
  conversation: ConversationDetail;
};

export function isCreateConversationResponse(
  data: unknown,
): data is CreateConversationResponse {
  return isConversationDetailResponse(data);
}

export type ConversationSettingsBody = {
  memoryDisabled?: boolean;
};

export function isConversationSettingsBody(
  data: unknown,
): data is ConversationSettingsBody {
  if (typeof data !== "object" || data === null) return false;
  if ("memoryDisabled" in data && typeof data.memoryDisabled !== "boolean")
    return false;
  return true;
}

export type ConversationSettingsResponse = {
  settings: Required<ConversationSettingsBody>;
};

export function isConversationSettingsResponse(
  data: unknown,
): data is ConversationSettingsResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "settings" in data &&
    isConversationSettingsBody(data.settings) &&
    data.settings !== undefined &&
    "memoryDisabled" in data.settings
  );
}

export type DbMessage = {
  id: string;
  createdAt: string;
  metadata: unknown;
  parts: unknown;
  role: "USER" | "ASSISTANT";
  conversationId: string;
};

export type ConversationMessagesResponse = {
  messages: DbMessage[];
};

export function isConversationMessagesResponse(
  data: unknown,
): data is ConversationMessagesResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "messages" in data &&
    Array.isArray(data.messages)
  );
}

export type CreateMessageResponse = {
  message: DbMessage;
};

export function isCreateMessageResponse(
  data: unknown,
): data is CreateMessageResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "object"
  );
}
