import { create } from "zustand";

export type ActiveView = null | "memories";

export interface ViewsStore {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export const useViewsStore = create<ViewsStore>((set) => ({
  activeView: null,
  setActiveView: (view) => {
    set({ activeView: view });
  },
}));
