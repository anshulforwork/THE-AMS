import { calculateStreak, getMonthStreak } from "./streak";
import type {
  AppSetup,
  DailyLog,
  DashboardStats,
  MonthlySummary,
} from "./types";

const MONTHS = [
  "2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11",
  "2026-12", "2027-01", "2027-02", "2027-03", "2027-04", "2027-05",
];

export function computeDashboard(
  logs: DailyLog[],
  setup: AppSetup
): DashboardStats {
  const filledLogs = logs.filter(
    (l) => l.learnHrs > 0 || l.expense > 0 || l.mood > 0
  );

  const totalSpent = filledLogs.reduce((s, l) => s + l.expense, 0);
  const totalLearnHrs = filledLogs.reduce((s, l) => s + l.learnHrs, 0);
  const daysStudied = filledLogs.filter((l) => l.learnHrs > 0).length;
  const moodLogs = filledLogs.filter((l) => l.mood > 0);
  const prodLogs = filledLogs.filter((l) => l.productivity > 0);
  const exerciseDays = filledLogs.filter((l) => l.exercise).length;

  const avgMood =
    moodLogs.length > 0
      ? moodLogs.reduce((s, l) => s + l.mood, 0) / moodLogs.length
      : 0;
  const avgProductivity =
    prodLogs.length > 0
      ? prodLogs.reduce((s, l) => s + l.productivity, 0) / prodLogs.length
      : 0;

  const monthsWithData = new Set(
    filledLogs.map((l) => l.date.slice(0, 7))
  ).size || 1;
  const monthlyIncome = setup.monthlyIncome * monthsWithData;
  const savingsRate =
    monthlyIncome > 0
      ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100
      : 0;

  const roiMultiple =
    setup.udemyCost > 0
      ? (setup.monthlyIncome * 0.4 * 12) / setup.udemyCost
      : 0;

  const streak = calculateStreak(logs);

  const monthlySummary: MonthlySummary[] = MONTHS.map((month) => {
    const monthLogs = filledLogs.filter((l) => l.date.startsWith(month));
    const learnHrs = monthLogs.reduce((s, l) => s + l.learnHrs, 0);
    const daysStudied = monthLogs.filter((l) => l.learnHrs > 0).length;
    const expense = monthLogs.reduce((s, l) => s + l.expense, 0);
    const moods = monthLogs.filter((l) => l.mood > 0);
    const prods = monthLogs.filter((l) => l.productivity > 0);

    return {
      month,
      learnHrs,
      daysStudied,
      expense,
      moodAvg:
        moods.length > 0
          ? moods.reduce((s, l) => s + l.mood, 0) / moods.length
          : 0,
      prodAvg:
        prods.length > 0
          ? prods.reduce((s, l) => s + l.productivity, 0) / prods.length
          : 0,
      streak: getMonthStreak(logs, month),
    };
  });

  return {
    monthlyIncome: setup.monthlyIncome,
    totalSpent,
    savingsRate,
    totalLearnHrs,
    daysStudied,
    roiMultiple,
    avgMood,
    avgProductivity,
    exerciseDays,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    monthlySummary,
  };
}

export function expensesByCategory(logs: DailyLog[]) {
  const map: Record<string, number> = {};
  for (const log of logs) {
    if (log.expense > 0) {
      const cat = log.category || "Other";
      map[cat] = (map[cat] ?? 0) + log.expense;
    }
  }
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}
