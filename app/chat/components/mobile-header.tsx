"use client";

import { useState } from "react";
import { ListIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/lib/store/chat-store";
import { useConversations } from "@/lib/hooks/use-conversations";
import { SidebarConversationButton } from "./sidebar-conversation-button";
import { UserSettingsDialog } from "./user-settings-dialog";

export const MobileHeader = () => {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data: conversations = [], isLoading } = useConversations();

  const setActiveConversationId = useChatStore(
    (s) => s.setActiveConversationId,
  );

  return (
    <header className="flex shrink-0 items-center justify-between rounded-xl bg-background p-3 shadow-sm lg:hidden">
      <BrandLogo />
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="icon"
          onClick={() => setActiveConversationId(null)}
        >
          <PlusIcon className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
          <SettingsIcon className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
          <ListIcon className="size-4" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sessions</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60dvh]">
            <div className="flex flex-col gap-1">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 animate-pulse rounded-md bg-muted"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))
              ) : conversations.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No sessions yet
                </p>
              ) : (
                conversations.map((conversation) => (
                  <SidebarConversationButton
                    key={conversation.id}
                    id={conversation.id}
                    title={conversation.title}
                    onClick={() => setOpen(false)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <UserSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};
