"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ArrowLeftIcon, NotebookPenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useViewsStore } from "@/lib/store/views-store";
import { useChatStore } from "@/lib/store/chat-store";
import { useJournalStore } from "@/lib/store/journal-store";
import { useShallow } from "zustand/react/shallow";
import { queryFactory } from "@/lib/queryFactory";
import {
  isJournalDatesResponse,
  isJournalEntryResponse,
  isJournalAccessResponse,
} from "@/lib/types/journal";
import { JournalCalendar } from "./journal-calendar";
import {
  JournalEntryDisplay,
  JournalEntryEmpty,
} from "./journal-entry-display";
import { JournalEntryEditor } from "./journal-entry-editor";
import { JournalUpgradeDialog } from "./journal-upgrade-dialog";
import type { JournalEntryResponse } from "@/lib/types/journal";

function toDateKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export const JournalView = () => {
  const queryClient = useQueryClient();
  const setActiveView = useViewsStore(useShallow((s) => s.setActiveView));
  const setActiveConversationId = useChatStore(
    (s) => s.setActiveConversationId,
  );
  const { selectedDate, setSelectedDate } = useJournalStore();

  const [isEditing, setIsEditing] = useState(false);
  const [calendarYear, setCalendarYear] = useState(
    selectedDate.getUTCFullYear(),
  );
  const [calendarMonth, setCalendarMonth] = useState(
    selectedDate.getUTCMonth(),
  );
  const [showUpgrade, setShowUpgrade] = useState(false);

  const { data: accessData } = useQuery({
    queryKey: ["journal-access"],
    queryFn: () =>
      queryFactory("/api/journal/access", {}, isJournalAccessResponse),
  });

  const canEdit = accessData?.canEdit ?? false;

  const { data: datesData } = useQuery({
    queryKey: ["journal-dates", calendarYear, calendarMonth + 1],
    queryFn: () =>
      queryFactory(
        `/api/journal?year=${calendarYear}&month=${calendarMonth + 1}`,
        {},
        isJournalDatesResponse,
      ),
  });

  const entryDates = useMemo(() => {
    if (!datesData) return new Set<string>();
    return new Set(
      datesData.dates.map((d) => {
        const date = new Date(d);
        return toDateKey(date);
      }),
    );
  }, [datesData]);

  const selectedDateKey = toDateKey(selectedDate);
  // selectedDate is always UTC midnight of the local calendar day (normalised in the store)
  const selectedDateISO = selectedDate.toISOString();

  const { data: entryData, isLoading: isEntryLoading } = useQuery({
    queryKey: ["journal-entry", selectedDateKey],
    queryFn: () =>
      queryFactory(
        `/api/journal/${selectedDateISO}`,
        {},
        isJournalEntryResponse,
      ),
  });

  const saveMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDateISO, content }),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["journal-entry", selectedDateKey],
      });
      queryClient.invalidateQueries({
        queryKey: ["journal-dates", calendarYear, calendarMonth + 1],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/journal/${selectedDateISO}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["journal-entry", selectedDateKey],
      });
      queryClient.invalidateQueries({
        queryKey: ["journal-dates", calendarYear, calendarMonth + 1],
      });
    },
  });

  const entry = entryData?.entry ?? null;

  const handleSelectDate = (date: Date) => {
    setIsEditing(false);
    setSelectedDate(date);
  };

  const handleChangeMonth = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const handleWrite = () => {
    if (!canEdit) {
      setShowUpgrade(true);
      return;
    }
    setIsEditing(true);
  };

  const handleEdit = () => {
    if (!canEdit) {
      setShowUpgrade(true);
      return;
    }
    setIsEditing(true);
  };

  const handleStartSession = () => {
    setActiveConversationId(null);
    setActiveView(null);
  };

  return (
    <div className="relative flex min-h-0 h-full flex-col rounded-xl bg-background shadow-sm">
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
          <NotebookPenIcon className="size-5 text-primary" />
          <h1 className="text-lg font-semibold">Journal</h1>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Calendar panel */}
        <div className="border-b p-4 md:w-80 md:border-b-0 md:border-r">
          <JournalCalendar
            year={calendarYear}
            month={calendarMonth}
            selectedDate={selectedDate}
            entryDates={entryDates}
            onSelectDate={handleSelectDate}
            onChangeMonth={handleChangeMonth}
          />
        </div>

        {/* Entry panel */}
        <div className="flex h-full w-full overflow-y-hidden flex-col">
          <EntryPanel
            isLoading={isEntryLoading}
            isEditing={isEditing}
            entry={entry}
            canEdit={canEdit}
            selectedDate={selectedDate}
            isSaving={saveMutation.isPending}
            onSave={(content) => saveMutation.mutate(content)}
            onCancelEdit={() => setIsEditing(false)}
            onEdit={handleEdit}
            onDelete={() => deleteMutation.mutate()}
            onWrite={handleWrite}
            onStartSession={handleStartSession}
          />
        </div>
      </div>

      <JournalUpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
};

const EntryPanel = ({
  isLoading,
  isEditing,
  entry,
  canEdit,
  selectedDate,
  isSaving,
  onSave,
  onCancelEdit,
  onEdit,
  onDelete,
  onWrite,
  onStartSession,
}: {
  isLoading: boolean;
  isEditing: boolean;
  entry: JournalEntryResponse | null;
  canEdit: boolean;
  selectedDate: Date;
  isSaving: boolean;
  onSave: (content: string) => void;
  onCancelEdit: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onWrite: () => void;
  onStartSession: () => void;
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-3 p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-6 animate-pulse rounded bg-muted"
            style={{ animationDelay: `${i * 100}ms`, width: `${80 - i * 20}%` }}
          />
        ))}
      </div>
    );
  }

  if (isEditing) {
    return (
      <JournalEntryEditor
        initialContent={entry?.content ?? ""}
        onSave={onSave}
        onCancel={onCancelEdit}
        isSaving={isSaving}
      />
    );
  }

  if (entry) {
    return (
      <JournalEntryDisplay
        content={entry.content}
        updatedAt={entry.updatedAt}
        canEdit={canEdit}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <JournalEntryEmpty
      canEdit={canEdit}
      selectedDate={selectedDate}
      onWrite={onWrite}
      onStartSession={onStartSession}
    />
  );
};
