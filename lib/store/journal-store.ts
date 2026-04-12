import { create } from "zustand";

function localDayToUTCMidnight(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export interface JournalStore {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const useJournalStore = create<JournalStore>((set) => ({
  selectedDate: localDayToUTCMidnight(new Date()),
  setSelectedDate: (date) => set({ selectedDate: localDayToUTCMidnight(date) }),
}));
