"use client";

import { useMemo } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface JournalCalendarProps {
  year: number;
  month: number; // 0-indexed
  selectedDate: Date;
  entryDates: Set<string>;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (year: number, month: number) => void;
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const JournalCalendar = ({
  year,
  month,
  selectedDate,
  entryDates,
  onSelectDate,
  onChangeMonth,
}: JournalCalendarProps) => {
  const displayedMonth = useMemo(() => new Date(year, month, 1), [year, month]);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <Calendar
      mode="single"
      required
      selected={selectedDate}
      onSelect={(date) => {
        if (date) onSelectDate(date);
      }}
      month={displayedMonth}
      onMonthChange={(date) =>
        onChangeMonth(date.getFullYear(), date.getMonth())
      }
      disabled={{ after: today }}
      showOutsideDays={false}
      className="w-full p-0 [--cell-size:--spacing(10)]"
      components={{
        DayButton: ({ className, ...props }) => {
          const hasEntry = entryDates.has(toDateKey(props.day.date));
          return (
            <CalendarDayButton
              {...props}
              className={cn(
                className,
                hasEntry &&
                  "after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-[''] data-[selected-single=true]:after:bg-primary-foreground",
              )}
            />
          );
        },
      }}
    />
  );
};
