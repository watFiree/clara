import { AnimationPhase } from "@/lib/store/homepage-store";

export const animationConfig: Record<
  Exclude<AnimationPhase, "done">,
  { nextPhase: AnimationPhase; delay: number }
> = {
  landing: {
    nextPhase: "meet",
    delay: 1200,
  },
  meet: {
    nextPhase: "pause",
    delay: 750,
  },
  pause: {
    nextPhase: "clara",
    delay: 1250,
  },
  clara: {
    nextPhase: "done",
    delay: 900,
  },
};
