"use client";

import {
  PlusIcon,
  BrainIcon,
  NotebookPenIcon,
  TargetIcon,
  SmileIcon,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/lib/store/chat-store";
import { useViewsStore } from "@/lib/store/views-store";
import { SidebarItemButton } from "./sidebar-item-button";

interface SidebarFeatureNavProps {
  onItemClick?: () => void;
}

export const SidebarFeatureNav = ({ onItemClick }: SidebarFeatureNavProps) => {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const setActiveConversationId = useChatStore(
    (s) => s.setActiveConversationId,
  );
  const activeView = useViewsStore(useShallow((s) => s.activeView));
  const setActiveView = useViewsStore(useShallow((s) => s.setActiveView));

  return (
    <div className="flex flex-col gap-1">
      <SidebarItemButton
        icon={PlusIcon}
        label="New session"
        active={activeConversationId === null && activeView === null}
        onClick={() => {
          setActiveConversationId(null);
          setActiveView(null);
          onItemClick?.();
        }}
      />
      <SidebarItemButton
        icon={BrainIcon}
        label="Memories"
        status="beta"
        active={activeView === "memories"}
        onClick={() => {
          setActiveView("memories");
          onItemClick?.();
        }}
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
  );
};
