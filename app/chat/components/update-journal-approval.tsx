"use client";

import { useState } from "react";
import {
  CheckIcon,
  XIcon,
  PenLineIcon,
  EyeIcon,
  NotebookPenIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { MessageResponse } from "@/components/ai-elements/message";
import type { Tool, UIToolInvocation } from "ai";
import type {
  UpdateJournalInput,
  UpdateJournalOutput,
} from "@/lib/tools/update-journal/consts";

type UpdateJournalApprovalProps = {
  toolCallId: string;
  input: UpdateJournalInput | undefined;
  state: UIToolInvocation<Tool>["state"];
  output?: UpdateJournalOutput;
  addToolOutput: (args: {
    tool: "updateJournal";
    toolCallId: string;
    output: UpdateJournalOutput;
  }) => void;
};

export function UpdateJournalApproval({
  toolCallId,
  input,
  state,
  output,
  addToolOutput,
}: UpdateJournalApprovalProps) {
  // null = user hasn't edited yet, so we always reflect the latest input.content
  console.log(input, state);
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const content = editedContent ?? input?.content ?? "";
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (state === "input-streaming") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <NotebookPenIcon className="size-3.5" />
        <Shimmer as="span" className="text-xs">
          Writing journal entry...
        </Shimmer>
      </span>
    );
  }

  if (state === "output-available" && output) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <NotebookPenIcon className="size-3.5" />
        <span>
          {output.saved
            ? `Journal entry saved for ${input?.date}`
            : "Journal entry was not saved"}
        </span>
      </span>
    );
  }

  const handleApprove = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: input?.date, content }),
      });

      const saved = res.ok;
      addToolOutput({
        tool: "updateJournal",
        toolCallId,
        output: { approved: true, saved },
      });
    } catch {
      addToolOutput({
        tool: "updateJournal",
        toolCallId,
        output: { approved: true, saved: false },
      });
    }
    setIsSaving(false);
  };

  const handleReject = () => {
    addToolOutput({
      tool: "updateJournal",
      toolCallId,
      output: { approved: false, saved: false },
    });
  };

  return (
    <Card className="max-w-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <NotebookPenIcon className="size-4 text-primary" />
          Journal entry for {input?.date}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-1">
          <Button
            variant={isEditing ? "ghost" : "secondary"}
            size="sm"
            className="h-6 gap-1 text-[10px]"
            onClick={() => setIsEditing(false)}
          >
            <EyeIcon className="size-3" />
            Preview
          </Button>
          <Button
            variant={isEditing ? "secondary" : "ghost"}
            size="sm"
            className="h-6 gap-1 text-[10px]"
            onClick={() => setIsEditing(true)}
          >
            <PenLineIcon className="size-3" />
            Edit
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto rounded-md border p-3">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[150px] resize-none border-0 rounded-none p-0 text-sm shadow-none focus-visible:ring-0"
            />
          ) : (
            <MessageResponse>{content}</MessageResponse>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleApprove}
            disabled={isSaving}
          >
            <CheckIcon className="size-3.5" />
            {isSaving ? "Saving..." : "Save to Journal"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleReject}
            disabled={isSaving}
          >
            <XIcon className="size-3.5" />
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
