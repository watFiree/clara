import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  "coming-soon": {
    label: "Coming soon",
    className:
      "border-transparent bg-muted-foreground/80 font-semibold text-white",
  },
  beta: {
    label: "Beta",
    className: "border-primary/30 text-primary bg-primary/10",
  },
  new: {
    label: "New",
    className: "border-green-500/30 text-green-600 bg-green-500/10",
  },
} as const;

export type Status = keyof typeof statusConfig;

export const StatusBadge = ({ status }: { status: Status }) => {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] px-1 py-0", config.className)}
    >
      {config.label}
    </Badge>
  );
};
