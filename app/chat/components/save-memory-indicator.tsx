import { Shimmer } from "@/components/ai-elements/shimmer";
import type { SaveMemoryToolPart } from "@/lib/tools/helpers";
import { PencilIcon } from "lucide-react";

export const SaveMemoryIndicator = ({ part }: { part: SaveMemoryToolPart }) => {
  const isRunning = part.state !== "output-available";

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <PencilIcon className="size-3.5" />
      {isRunning ? (
        <Shimmer as="span" className="text-xs">
          Saving to memory...
        </Shimmer>
      ) : (
        <span>Saved to memory</span>
      )}
    </span>
  );
};
