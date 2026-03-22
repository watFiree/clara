"use client";

import {
  PlusIcon,
  BrainIcon,
  NotebookPenIcon,
  TargetIcon,
  SmileIcon,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { BrandLogo } from "@/components/brand-logo";
import { useConversations } from "@/lib/hooks/use-conversations";
import { useChatStore } from "@/lib/store/chat-store";
import { useViewsStore } from "@/lib/store/views-store";
import { SidebarConversationButton } from "./sidebar-conversation-button";
import { SidebarItemButton } from "./sidebar-item-button";
import { SidebarUserButton } from "./sidebar-user-button";

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

export const ChatSidebar = () => {
  const { data: conversations, isLoading } = useConversations();
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const setActiveConversationId = useChatStore(
    (s) => s.setActiveConversationId,
  );
  const activeView = useViewsStore(useShallow((s) => s.activeView));
  const setActiveView = useViewsStore(useShallow((s) => s.setActiveView));

  return (
    <aside className="hidden w-64 shrink-0 flex-col rounded-xl bg-background shadow-sm lg:flex">
      <div className="p-4">
        <BrandLogo />
      </div>

      <div className="flex flex-col gap-1 px-3 pb-4">
        <SidebarItemButton
          icon={PlusIcon}
          label="New session"
          active={activeConversationId === null && activeView === null}
          onClick={() => {
            setActiveConversationId(null);
            setActiveView(null);
          }}
        />
        <SidebarItemButton
          icon={BrainIcon}
          label="Memories"
          status="beta"
          active={activeView === "memories"}
          onClick={() => setActiveView("memories")}
        />
        <SidebarItemButton
          icon={NotebookPenIcon}
          label="Journal"
          status="coming-soon"
        />
        <SidebarItemButton
          icon={TargetIcon}
          label="Planner"
          status="coming-soon"
        />
        <SidebarItemButton
          icon={SmileIcon}
          label="Mood tracker"
          status="coming-soon"
        />
      </div>

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
            />
          ))
        )}
      </div>

      <div className="border-t px-3 py-3">
        <SidebarUserButton />
      </div>
    </aside>
  );
};
