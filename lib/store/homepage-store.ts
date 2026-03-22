import { create } from "zustand";

export type AnimationPhase = "landing" | "meet" | "pause" | "clara" | "done";

export interface HomepageStore {
  animationPhase: AnimationPhase;
  setAnimationPhase: (phase: AnimationPhase) => void;
}

export const useHomepageStore = create<HomepageStore>((set) => ({
  animationPhase: "landing",
  setAnimationPhase: (phase) => {
    set({ animationPhase: phase });
  },
}));
