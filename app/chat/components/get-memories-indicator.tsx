import { Shimmer } from "@/components/ai-elements/shimmer";
import type { GetMemoriesToolPart } from "@/lib/tools/helpers";
import { BookOpenIcon } from "lucide-react";

export const GetMemoriesIndicator = ({
  part,
}: {
  part: GetMemoriesToolPart;
}) => {
  const isRunning = part.state !== "output-available";
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <BookOpenIcon className="size-3.5" />
      {isRunning ? (
        <Shimmer as="span" className="text-xs">
          Recalling memories...
        </Shimmer>
      ) : (
        <span>Recalled memories</span>
      )}
    </span>
  );
};
