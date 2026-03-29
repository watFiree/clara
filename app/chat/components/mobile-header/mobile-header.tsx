"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarFeatureNav } from "../sidebar/sidebar-feature-nav";
import { SidebarUserButton } from "../sidebar/sidebar-user-button";
import { SidebarConversationsList } from "../sidebar/sidebar-conversations-list";
import { SettingsButton } from "./settings-dialog";
import { NewSession } from "./new-session";
import { useQuery } from "@tanstack/react-query";
import { queryFactory } from "@/lib/queryFactory";
import { isCloudMode } from "@/config";
import { SignUp } from "./signup";

export const MobileHeader = () => {
  const [open, setOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      queryFactory(
        "/api/user",
        {},
        (d): d is { user: { id: string; authProvider: string } } =>
          d != null && typeof d === "object" && "user" in d,
      ).then((d) => d.user),
  });

  const isLocalUser = !user || user.authProvider === "local";

  return (
    <header className="flex shrink-0 items-center justify-between rounded-xl bg-background p-3 shadow-sm lg:hidden">
      <BrandLogo />
      <div className="flex items-center gap-2">
        {!isCloudMode || !isLocalUser ? (
          <>
            <NewSession />
            <SettingsButton />
          </>
        ) : (
          <SignUp />
        )}
        <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
          <MenuIcon className="size-4" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex flex-col gap-0 p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="p-3">
            <SidebarFeatureNav onItemClick={() => setOpen(false)} />
          </div>

          <SidebarConversationsList onClick={() => setOpen(false)} />

          <div className="border-t px-3 py-3">
            <SidebarUserButton />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
