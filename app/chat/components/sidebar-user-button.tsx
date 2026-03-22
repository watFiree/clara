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
import { isUserSettingsResponse } from "@/lib/types/settings";
import { UserSettingsDialog } from "./user-settings-dialog";
import { BillingDialog } from "./billing-dialog";
import { isCloudMode } from "@/config";

export const SidebarUserButton = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data: unknown = await res.json();
      if (!isUserSettingsResponse(data))
        throw new Error("Invalid settings response");
      return data.settings;
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = (await res.json()) as {
        user: { id: string; authProvider: string };
      };
      return data.user;
    },
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
                <a href="/auth/login">
                  <LogInIcon className="size-4" />
                  Sign in
                </a>
              </DropdownMenuItem>
            </>
          )}

          {isCloudMode && !isLocalUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/auth/logout">
                  <LogOutIcon className="size-4" />
                  Sign out
                </a>
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
