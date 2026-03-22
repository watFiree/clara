import { cn } from "@/lib/utils";

const BubbleSkeleton = ({
  side,
  widths,
}: {
  side: "left" | "right";
  widths: string[];
}) => (
  <div
    className={cn(
      "flex items-end gap-2.5",
      side === "right" && "flex-row-reverse",
    )}
  >
    <div className="size-6 shrink-0 animate-pulse rounded-full bg-muted" />
    <div
      className={cn(
        "flex max-w-[85%] flex-col gap-1.5 rounded-2xl bg-muted px-4 py-3",
        side === "right" && "items-end",
      )}
    >
      {widths.map((w, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded-full bg-muted-foreground/15"
          style={{ width: w, animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  </div>
);

export const MessageListSkeleton = () => (
  <div className="flex flex-1 flex-col rounded-xl bg-background shadow-sm">
    <div className="flex flex-1 flex-col gap-6 p-6">
      <BubbleSkeleton side="right" widths={["120px"]} />
      <BubbleSkeleton side="left" widths={["200px", "160px"]} />
      <BubbleSkeleton side="right" widths={["180px"]} />
      <BubbleSkeleton side="left" widths={["240px", "200px", "100px"]} />
    </div>
  </div>
);
