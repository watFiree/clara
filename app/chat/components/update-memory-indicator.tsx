import { Shimmer } from "@/components/ai-elements/shimmer";
import type { UpdateMemoryToolPart } from "@/lib/tools/helpers";
import { RefreshCwIcon } from "lucide-react";

export const UpdateMemoryIndicator = ({
  part,
}: {
  part: UpdateMemoryToolPart;
}) => {
  const isRunning = part.state !== "output-available";

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <RefreshCwIcon className="size-3.5" />
      {isRunning ? (
        <Shimmer as="span" className="text-xs">
          Updating memory...
        </Shimmer>
      ) : (
        <span>Updated memory</span>
      )}
    </span>
  );
};
