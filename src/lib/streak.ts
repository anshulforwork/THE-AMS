import { toDateKey } from "./utils";
import type { DailyLog, StreakStats } from "./types";

export function calculateStreak(logs: DailyLog[]): StreakStats {
  const checkinDates = new Set<string>();
  const heatmap: Record<string, number> = {};

  for (const log of logs) {
    if (log.checkinTimestamp || log.learnHrs > 0 || log.mood > 0) {
      checkinDates.add(log.date);
      heatmap[log.date] = (heatmap[log.date] ?? 0) + 1;
    }
  }

  const sortedDates = [...checkinDates].sort();
  let current = 0;
  let longest = 0;
  let streak = 0;

  const today = toDateKey(new Date());
  const yesterday = toDateKey(new Date(Date.now() - 86400000));

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / 86400000
      );
      streak = diffDays === 1 ? streak + 1 : 1;
    }
    longest = Math.max(longest, streak);
  }

  if (checkinDates.has(today)) {
    current = 1;
    let d = new Date(today);
    while (true) {
      d = new Date(d.getTime() - 86400000);
      const key = toDateKey(d);
      if (checkinDates.has(key)) current++;
      else break;
    }
  } else if (checkinDates.has(yesterday)) {
    current = 1;
    let d = new Date(yesterday);
    while (true) {
      d = new Date(d.getTime() - 86400000);
      const key = toDateKey(d);
      if (checkinDates.has(key)) current++;
      else break;
    }
  }

  return {
    current,
    longest,
    totalCheckins: checkinDates.size,
    heatmap,
  };
}

export function getMonthStreak(logs: DailyLog[], monthKey: string): number {
  const monthLogs = logs.filter((l) => l.date.startsWith(monthKey));
  const dates = new Set(monthLogs.map((l) => l.date));
  let max = 0;
  let streak = 0;
  const sorted = [...dates].sort();

  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) streak = 1;
    else {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
      streak = diff === 1 ? streak + 1 : 1;
    }
    max = Math.max(max, streak);
  }
  return max;
}
