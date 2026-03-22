import { cn } from "@/lib/utils";

export const BrandBubble = ({ className }: { className?: string }) => (
  <div
    className={cn("relative shrink-0 rounded-full", className)}
    style={{
      background:
        "radial-gradient(circle at 35% 30%, #ffe0a0, #ffbc47 40%, #e8920a 75%, #c06a00)",
      boxShadow:
        "inset -2px -3px 6px rgba(160, 61, 0, 0.4), inset 2px 2px 8px rgba(255, 240, 200, 0.6), 0 2px 8px rgba(255, 188, 71, 0.35)",
    }}
  >
    <div
      className="absolute left-[20%] top-[15%] h-[35%] w-[45%] rounded-full"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0) 70%)",
      }}
    />
  </div>
);

export const UserBubble = ({ className }: { className?: string }) => (
  <div
    className={cn("relative shrink-0 rounded-full", className)}
    style={{
      background:
        "radial-gradient(circle at 35% 30%, #e8e8e8, #b8b8b8 40%, #8a8a8a 75%, #6a6a6a)",
      boxShadow:
        "inset -2px -3px 6px rgba(80, 80, 80, 0.4), inset 2px 2px 8px rgba(240, 240, 240, 0.6), 0 2px 8px rgba(150, 150, 150, 0.35)",
    }}
  >
    <div
      className="absolute left-[20%] top-[15%] h-[35%] w-[45%] rounded-full"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0) 70%)",
      }}
    />
  </div>
);

export const BrandLogo = () => (
  <div className="flex items-center gap-2.5">
    <BrandBubble className="size-8" />
    <span className="text-lg font-bold tracking-wide">clara</span>
  </div>
);
