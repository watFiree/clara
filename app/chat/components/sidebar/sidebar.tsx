"use client";

import { BrandLogo } from "@/components/brand-logo";
import { SidebarFeatureNav } from "./sidebar-feature-nav";
import { SidebarUserButton } from "./sidebar-user-button";
import { SidebarConversationsList } from "./sidebar-conversations-list";

export const ChatSidebar = () => {
  return (
    <aside className="hidden w-64 shrink-0 flex-col rounded-xl bg-background shadow-sm lg:flex">
      <div className="p-4">
        <BrandLogo />
      </div>

      <div className="px-3 pb-4">
        <SidebarFeatureNav />
      </div>

      <SidebarConversationsList />

      <div className="border-t px-3 py-3">
        <SidebarUserButton />
      </div>
    </aside>
  );
};
