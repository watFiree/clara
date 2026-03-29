"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCardIcon,
  LogInIcon,
  LogOutIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import { UserBubble } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryFactory } from "@/lib/queryFactory";
import { isUserSettingsResponse } from "@/lib/types/settings";
import { UserSettingsDialog } from "../user-settings-dialog";
import { BillingDialog } from "../billing-dialog";
import { isCloudMode } from "@/config";
import Link from "next/link";

export const SidebarUserButton = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () =>
      queryFactory("/api/settings", {}, isUserSettingsResponse).then(
        (d) => d.settings,
      ),
  });

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

  const [deleteOpen, setDeleteOpen] = useState(false);

  const isLocalUser = !user || user.authProvider === "local";

  const handleDeleteAccount = async () => {
    await fetch("/api/user", { method: "DELETE" });
    window.location.href = "/";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-2.5 rounded-lg p-2.5 text-left transition-colors hover:bg-muted">
            <UserBubble className="size-8" />
            <span className="flex-1 truncate text-sm">
              {settings?.name || "Set up your profile"}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="top" align="end" className="w-56">
          <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
            <SettingsIcon className="size-4" />
            Profile
          </DropdownMenuItem>

          {isCloudMode && (
            <DropdownMenuItem onSelect={() => setBillingOpen(true)}>
              <CreditCardIcon className="size-4" />
              Billing
            </DropdownMenuItem>
          )}

          {isCloudMode && isLocalUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth/login" className="text-primary font-bold">
                  <LogInIcon className="size-4 text-primary" />
                  Get Full Access
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {isCloudMode && !isLocalUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth/logout">
                  <LogOutIcon className="size-4" />
                  Sign out
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setDeleteOpen(true)}>
            <Trash2Icon className="size-4" />
            Delete account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      {isCloudMode && (
        <BillingDialog open={billingOpen} onOpenChange={setBillingOpen} />
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all your
              conversations. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
