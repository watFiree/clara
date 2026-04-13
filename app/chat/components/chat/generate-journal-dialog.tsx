"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  NotebookPenIcon,
  EyeIcon,
  PenLineIcon,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageResponse } from "@/components/ai-elements/message";
import { queryFactory } from "@/lib/queryFactory";
import {
  isJournalAccessResponse,
  isJournalGenerateResponse,
} from "@/lib/types/journal";
import { JournalUpgradeDialog } from "../journal-upgrade-dialog";

interface GenerateJournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

export const GenerateJournalDialog = ({
  open,
  onOpenChange,
  conversationId,
}: GenerateJournalDialogProps) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState(true);
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: accessData } = useQuery({
    queryKey: ["journal-access"],
    queryFn: () =>
      queryFactory("/api/journal/access", {}, isJournalAccessResponse),
    enabled: open,
  });

  const canEdit = accessData?.canEdit ?? false;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/journal/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.error === "generation_limit_reached") {
          setShowUpgrade(true);
          setIsGenerating(false);
          return;
        }
        throw new Error(body?.error || "Failed to generate");
      }

      const data: unknown = await res.json();
      if (isJournalGenerateResponse(data)) {
        setContent(data.content);
        setGenerated(true);
        queryClient.invalidateQueries({ queryKey: ["journal-access"] });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate");
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, content }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["journal-dates"] });
      queryClient.invalidateQueries({ queryKey: ["journal-entry"] });
    } catch {
      setError("Failed to save journal entry");
    }
    setIsSaving(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setContent("");
      setGenerated(false);
      setSaved(false);
      setError(null);
      setPreview(true);
    }
    onOpenChange(open);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <NotebookPenIcon className="size-5 text-primary" />
              Generate Journal Entry
            </DialogTitle>
            <DialogDescription>
              Create a reflective journal entry from this conversation
            </DialogDescription>
          </DialogHeader>

          {saved ? (
            <div className="space-y-3 text-center py-4">
              <p className="text-sm font-medium text-foreground">
                Journal entry saved for today!
              </p>
              <p className="text-xs text-muted-foreground">
                You can view and edit it in the Journal view.
              </p>
              <Button size="sm" onClick={() => handleClose(false)}>
                Done
              </Button>
            </div>
          ) : !generated ? (
            <div className="space-y-3 py-2">
              {accessData && accessData.monthlyGenerationLimit > 0 && (
                <p className="text-xs text-muted-foreground">
                  {accessData.monthlyGenerationCount}/
                  {accessData.monthlyGenerationLimit} generations used this
                  month
                </p>
              )}
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Entry"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <Button
                  variant={preview ? "secondary" : "ghost"}
                  size="sm"
                  className="h-6 gap-1 text-[10px]"
                  onClick={() => setPreview(true)}
                >
                  <EyeIcon className="size-3" />
                  Preview
                </Button>
                {canEdit && (
                  <Button
                    variant={!preview ? "secondary" : "ghost"}
                    size="sm"
                    className="h-6 gap-1 text-[10px]"
                    onClick={() => setPreview(false)}
                  >
                    <PenLineIcon className="size-3" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto rounded-md border p-3">
                {preview ? (
                  <MessageResponse>{content}</MessageResponse>
                ) : (
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px] resize-none border-0 rounded-none p-0 text-sm shadow-none focus-visible:ring-0"
                  />
                )}
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClose(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !content.trim()}
                >
                  {isSaving ? "Saving..." : "Save to Journal"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <JournalUpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </>
  );
};
