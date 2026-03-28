import { create } from "zustand";

export interface PendingMessage {
  text: string;
  metadata?: Record<string, unknown>;
}

export interface ChatStore {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  newChatPendingMessage: PendingMessage | null;
  setNewChatPendingMessage: (message: PendingMessage | null) => void;
  pendingMemoryDisabled: boolean;
  setPendingMemoryDisabled: (value: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeConversationId: null,
  newChatPendingMessage: null,
  pendingMemoryDisabled: false,
  setNewChatPendingMessage: (message) => {
    set({ newChatPendingMessage: message });
  },
  setActiveConversationId: (id) => {
    set({ activeConversationId: id, pendingMemoryDisabled: false });
  },
  setPendingMemoryDisabled: (value) => {
    set({ pendingMemoryDisabled: value });
  },
}));
