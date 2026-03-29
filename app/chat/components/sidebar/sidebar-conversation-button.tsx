"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/errors";
import { useChatStore } from "@/lib/store/chat-store";
import { useViewsStore } from "@/lib/store/views-store";

type DialogType = "rename" | "delete" | null;

export const SidebarConversationButton = ({
  id,
  title,
  onClick,
}: {
  id: string;
  title: string;
  onClick?: () => void;
}) => {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const setActiveConversationId = useChatStore(
    (s) => s.setActiveConversationId,
  );
  const setActiveView = useViewsStore((s) => s.setActiveView);
  const queryClient = useQueryClient();
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  const renameMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.error) throw new ApiError(body.error);
        throw new Error("Failed to rename");
      }
    },
    onSuccess: () => {
      setOpenDialog(null);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.error) throw new ApiError(body.error);
        throw new Error("Failed to delete");
      }
    },
    onSuccess: () => {
      setOpenDialog(null);
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return (
    <>
      <div
        className={cn(
          "group relative flex items-center rounded-md",
          "border",
          activeConversationId === id
            ? "border-primary bg-muted"
            : "border-transparent hover:border-primary",
        )}
      >
        <Button
          onClick={() => {
            setActiveConversationId(id);
            setActiveView(null);
            onClick?.();
          }}
          variant="ghost"
          className={cn(
            "w-full overflow-hidden justify-start truncate border-0 hover:bg-transparent",
            activeConversationId === id && "font-semibold",
          )}
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 size-7 shrink-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <EllipsisIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right">
            <DropdownMenuItem onSelect={() => setOpenDialog("rename")}>
              <PencilIcon className="size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpenDialog("delete")}>
              <Trash2Icon className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog
        open={openDialog === "rename"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
            <DialogDescription>
              Enter a new name for this conversation.
            </DialogDescription>
          </DialogHeader>
          <Input
            ref={renameInputRef}
            defaultValue={title}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = renameInputRef.current?.value.trim();
                if (value && value !== title) renameMutation.mutate(value);
              }
            }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const value = renameInputRef.current?.value.trim();
                if (value && value !== title) renameMutation.mutate(value);
              }}
              disabled={renameMutation.isPending}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === "delete"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete conversation</DialogTitle>
            <DialogDescription>
              This will permanently delete this conversation and all its
              messages. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
