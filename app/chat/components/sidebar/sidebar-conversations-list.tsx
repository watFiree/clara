"use client";

import {
  ConversationSummary,
  isConversationsListResponse,
} from "@/lib/types/api";
import { useQuery } from "@tanstack/react-query";
import { SidebarConversationButton } from "./sidebar-conversation-button";

interface SidebarConversationsListProps {
  onClick?: () => void;
}

export const SidebarConversationsList = ({
  onClick,
}: SidebarConversationsListProps) => {
  const { data: conversations, isLoading } = useQuery<ConversationSummary[]>({
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

  return (
    <div className="flex h-full overflow-x-hidden overflow-y-auto flex-col gap-1 px-3 pb-3">
      <span className="px-2 pt-1 pb-0.5 text-xs text-muted-foreground">
        Sessions
      </span>
      {isLoading ? (
        <ConversationListSkeleton />
      ) : (
        conversations?.map((conversation) => (
          <SidebarConversationButton
            key={conversation.id}
            id={conversation.id}
            title={conversation.title}
            onClick={onClick}
          />
        ))
      )}
    </div>
  );
};

const ConversationListSkeleton = () => (
  <div className="flex flex-col gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="h-9 animate-pulse rounded-md bg-muted"
        style={{ animationDelay: `${i * 100}ms` }}
      />
    ))}
  </div>
);
