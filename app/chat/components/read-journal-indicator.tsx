import { Shimmer } from "@/components/ai-elements/shimmer";
import type { ReadJournalToolPart } from "@/lib/tools/helpers";
import { NotebookPenIcon } from "lucide-react";

export const ReadJournalIndicator = ({
  part,
}: {
  part: ReadJournalToolPart;
}) => {
  const isRunning = part.state !== "output-available";
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <NotebookPenIcon className="size-3.5" />
      {isRunning ? (
        <Shimmer as="span" className="text-xs">
          Reading journal...
        </Shimmer>
      ) : (
        <span>Read journal entry</span>
      )}
    </span>
  );
};
