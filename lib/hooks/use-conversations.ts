import { useQuery } from "@tanstack/react-query";
import {
  isConversationsListResponse,
  type ConversationSummary,
} from "@/lib/types/api";

export const useConversations = () => {
  return useQuery<ConversationSummary[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data: unknown = await res.json();
      if (!isConversationsListResponse(data))
        throw new Error("Invalid conversations response");
      return data.conversations;
    },
  });
};
