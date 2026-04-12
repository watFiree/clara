"use client";

import { useViewsStore } from "@/lib/store/views-store";
import { useShallow } from "zustand/react/shallow";
import { MemoryView } from "./memory-view";
import { JournalView } from "./journal-view";

export const ViewsManager = () => {
  const activeView = useViewsStore(useShallow((s) => s.activeView));

  if (activeView === null) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      {activeView === "memories" && <MemoryView />}
      {activeView === "journal" && <JournalView />}
    </div>
  );
};
