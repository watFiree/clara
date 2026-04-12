"use client";

import { PenLineIcon, Trash2Icon, MessageCircleIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MessageResponse } from "@/components/ai-elements/message";

interface JournalEntryDisplayProps {
  content: string;
  updatedAt: string;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const JournalEntryDisplay = ({
  content,
  updatedAt,
  canEdit,
  onEdit,
  onDelete,
}: JournalEntryDisplayProps) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs text-muted-foreground">
          Last updated {new Date(updatedAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1">
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-muted-foreground gap-1.5 text-xs"
              onClick={onEdit}
            >
              <PenLineIcon className="size-3.5" />
              Edit
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      </div>
      <div className="p-4 overflow-y-auto">
        <MessageResponse>{content}</MessageResponse>
      </div>
    </div>
  );
};

export const JournalEntryEmpty = ({
  canEdit,
  selectedDate,
  onWrite,
  onStartSession,
}: {
  canEdit: boolean;
  selectedDate: Date;
  onWrite: () => void;
  onStartSession: () => void;
}) => {
  const formattedDate = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex flex-col items-center gap-1.5"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {formattedDate}
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Nothing written yet
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {canEdit
            ? "Reflect on your day with Clara, and she can turn the conversation into a journal entry — or write one yourself."
            : "Reflect on your day with Clara, and she can turn the conversation into a journal entry for you."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex flex-col items-center gap-2 sm:flex-row"
      >
        <Button size="sm" onClick={onStartSession} className="gap-1.5">
          <MessageCircleIcon className="size-4" />
          Start a new session
        </Button>
        {canEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onWrite}
            className="gap-1.5"
          >
            <PenLineIcon className="size-4" />
            Write manually
          </Button>
        )}
      </motion.div>
    </div>
  );
};
