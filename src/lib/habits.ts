import { toDateKey } from "./utils";
import type { Habit, HabitLog, HabitWithStats } from "./types";

export function computeHabitStats(habits: Habit[], logs: HabitLog[]): HabitWithStats[] {
  const byHabit: Record<string, Set<string>> = {};
  for (const log of logs) {
    (byHabit[log.habitId] ??= new Set()).add(log.date);
  }

  const today = toDateKey(new Date());
  const yesterday = toDateKey(new Date(Date.now() - 86400000));

  return habits.map((habit) => {
    const dates = byHabit[habit.id] ?? new Set<string>();
    const sorted = [...dates].sort();

    let longest = 0;
    let run = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0) run = 1;
      else {
        const diff = Math.round(
          (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000
        );
        run = diff === 1 ? run + 1 : 1;
      }
      longest = Math.max(longest, run);
    }

    let current = 0;
    const anchor = dates.has(today) ? today : dates.has(yesterday) ? yesterday : null;
    if (anchor) {
      current = 1;
      let d = new Date(anchor);
      while (true) {
        d = new Date(d.getTime() - 86400000);
        if (dates.has(toDateKey(d))) current++;
        else break;
      }
    }

    const last30: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const key = toDateKey(new Date(Date.now() - i * 86400000));
      if (dates.has(key)) last30.push(key);
    }

    return {
      ...habit,
      current,
      longest,
      doneToday: dates.has(today),
      last30,
    };
  });
}
