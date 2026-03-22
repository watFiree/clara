import { create } from "zustand";

export interface ChatStore {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  newChatPendingMessage: string;
  setNewChatPendingMessage: (message: string) => void;
  pendingMemoryDisabled: boolean;
  setPendingMemoryDisabled: (value: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeConversationId: null,
  newChatPendingMessage: "",
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
