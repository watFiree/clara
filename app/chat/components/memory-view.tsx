"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowLeftIcon,
  BrainIcon,
  Trash2Icon,
  ChevronDownIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  isMemoriesListResponse,
  type MemoryResponse,
} from "@/lib/types/memory";
import { useViewsStore } from "@/lib/store/views-store";
import { useShallow } from "zustand/react/shallow";

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  RESOLVED: "Resolved",
  SNOOZED: "Snoozed",
  EXPIRED: "Expired",
};

const STATUS_FILTERS = [
  "ALL",
  "OPEN",
  "RESOLVED",
  "SNOOZED",
  "EXPIRED",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  PERSONAL: "Personal",
  EMOTIONAL: "Emotional",
  HEALTH: "Health",
  GOALS: "Goals",
  COPING: "Coping",
  CONTEXT: "Context",
};

const STATUS_NEXT_ACTIONS: Record<
  string,
  Array<{ label: string; status: string }>
> = {
  OPEN: [
    { label: "Resolve", status: "RESOLVED" },
    { label: "Snooze", status: "SNOOZED" },
    { label: "Expire", status: "EXPIRED" },
  ],
  RESOLVED: [{ label: "Reopen", status: "OPEN" }],
  SNOOZED: [
    { label: "Reopen", status: "OPEN" },
    { label: "Expire", status: "EXPIRED" },
  ],
  EXPIRED: [{ label: "Reopen", status: "OPEN" }],
};

function getMemoryText(memory: MemoryResponse): string {
  if (memory.content.type === "fact") return memory.content.description;
  return `${memory.content.trigger} → ${memory.content.effect}`;
}

function groupByCategory(
  memories: MemoryResponse[],
): Record<string, MemoryResponse[]> {
  const groups: Record<string, MemoryResponse[]> = {};
  for (const m of memories) {
    if (!groups[m.category]) groups[m.category] = [];
    groups[m.category].push(m);
  }
  return groups;
}

export const MemoryView = () => {
  const queryClient = useQueryClient();
  const setActiveView = useViewsStore(useShallow((s) => s.setActiveView));
  const [statusFilter, setStatusFilter] = useState<string>("OPEN");

  const { data: memories, isLoading } = useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      const res = await fetch("/api/memories");
      if (!res.ok) {
        if (res.status === 403) return [];
        throw new Error("Failed to fetch memories");
      }
      const data: unknown = await res.json();
      if (!isMemoriesListResponse(data)) throw new Error("Invalid response");
      return data.memories;
    },
    refetchOnMount: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/memories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memories"] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/memories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memories"] }),
  });

  const filtered =
    statusFilter === "ALL"
      ? memories
      : memories?.filter((m) => m.status === statusFilter);

  const grouped = filtered ? groupByCategory(filtered) : {};
  const categoryOrder = Object.keys(CATEGORY_LABELS);
  const sortedCategories = categoryOrder.filter((c) => grouped[c]?.length);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col rounded-xl bg-background shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setActiveView(null)}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <BrainIcon className="size-5 text-primary" />
          <h1 className="text-lg font-semibold">Memories</h1>
          {memories && (
            <span className="text-sm text-muted-foreground">
              ({memories.length})
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1 border-b px-6 py-2">
        {STATUS_FILTERS.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setStatusFilter(s)}
          >
            {s === "ALL" ? "All" : STATUS_LABELS[s]}
          </Button>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-muted"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          )}

          {!isLoading && (!filtered || filtered.length === 0) && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <SparklesIcon className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">No memories yet</p>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  Clara will automatically remember important things you share
                  during your conversations.
                </p>
              </div>
            </div>
          )}

          {sortedCategories.map((category) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {CATEGORY_LABELS[category]}
              </h3>
              <div className="flex flex-col gap-2">
                {grouped[category].map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onDelete={() => deleteMutation.mutate(memory.id)}
                    onStatusChange={(status) =>
                      updateStatusMutation.mutate({
                        id: memory.id,
                        status,
                      })
                    }
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const MemoryCard = ({
  memory,
  onDelete,
  onStatusChange,
  isDeleting,
}: {
  memory: MemoryResponse;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
  isDeleting: boolean;
}) => {
  const [showActions, setShowActions] = useState(false);
  const actions = STATUS_NEXT_ACTIONS[memory.status] ?? [];

  return (
    <div className="group flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{getMemoryText(memory)}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px]">
            {STATUS_LABELS[memory.status]}
          </Badge>
          {memory.confidence < 1 && (
            <span className="text-[10px] text-muted-foreground">
              {Math.round(memory.confidence * 100)}% confidence
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {actions.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setShowActions(!showActions)}
            >
              <ChevronDownIcon className="size-3.5" />
            </Button>
            {showActions && (
              <div className="absolute right-0 top-8 z-10 min-w-[100px] rounded-md border bg-popover p-1 shadow-md">
                {actions.map((action) => (
                  <button
                    key={action.status}
                    className="w-full rounded-sm px-2 py-1 text-left text-xs hover:bg-accent"
                    onClick={() => {
                      onStatusChange(action.status);
                      setShowActions(false);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};
