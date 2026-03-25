"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type Status } from "@/components/ui/status-badge";

interface SidebarItemButtonProps {
  icon: LucideIcon;
  label: string;
  status?: Status;
  active?: boolean;
  onClick?: () => void;
}

export const SidebarItemButton = ({
  icon: Icon,
  label,
  status,
  active = false,
  onClick,
}: SidebarItemButtonProps) => {
  const isDisabled = status === "coming-soon";

  return (
    <Button
      onClick={onClick}
      variant={active ? "secondary" : "ghost"}
      disabled={isDisabled}
      className="w-full justify-start gap-2"
    >
      <Icon className="size-4" />
      {label}
      {status && (
        <span className="ml-auto">
          <StatusBadge status={status} />
        </span>
      )}
    </Button>
  );
};
