import type { DailyLog } from "./types";
import { parseNumber } from "./utils";

function parseExcelDate(value: unknown): string {
  if (!value) return "";
  if (typeof value === "number") {
    // Excel serial date
    const epoch = new Date(1899, 11, 30);
    const d = new Date(epoch.getTime() + value * 86400000);
    return d.toISOString().slice(0, 10);
  }
  const str = String(value).trim();
  const m = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  return str;
}

function hasData(learnHrs: number, expense: number, mood: number, productivity: number): boolean {
  return learnHrs > 0 || expense > 0 || mood > 0 || productivity > 0;
}

/** Parse daily logs from raw sheet rows (array-of-arrays format) */
export function parseDailyLogRows(rows: unknown[][]): DailyLog[] {
  let headerIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.some((cell) => String(cell).includes("Date") && String(cell).includes("📅"))) {
      headerIdx = i;
      break;
    }
  }

  if (headerIdx < 0) {
    // Fallback: find row where col0 looks like a date header
    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i][0]).includes("Date")) {
        headerIdx = i;
        break;
      }
    }
  }

  if (headerIdx < 0) return [];

  const logs: DailyLog[] = [];

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;

    const date = parseExcelDate(row[0]);
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) continue;

    const learnHrs = parseNumber(row[2]);
    const expense = parseNumber(row[4]);
    const mood = parseNumber(row[6]);
    const productivity = parseNumber(row[7]);

    if (!hasData(learnHrs, expense, mood, productivity)) continue;

    const exerciseVal = String(row[8] ?? "").toLowerCase().trim();
    const journalVal = String(row[9] ?? "").toLowerCase().trim();

    logs.push({
      date,
      day: String(row[1] ?? new Date(date).toLocaleDateString("en-US", { weekday: "long" })),
      learnHrs,
      course: String(row[3] ?? ""),
      expense,
      category: String(row[5] ?? ""),
      mood,
      productivity,
      exercise: exerciseVal === "yes" || exerciseVal === "y",
      journalDone: journalVal === "yes" || journalVal === "y",
      keyLearning: String(row[10] ?? "").trim(),
      journalText: "",
      checkinTimestamp: new Date(date).toISOString(),
    });
  }

  return logs;
}

/** Parse setup values from raw sheet rows */
export function parseSetupFromRows(rows: unknown[][]): Record<string, string> {
  const setup: Record<string, string> = {};

  for (const row of rows) {
    const label = String(row[0] ?? "");
    const value = row[2] ?? row[1];

    if (label.includes("Monthly Salary") || label.includes("Income")) {
      setup.monthly_income = String(value);
    } else if (label.includes("Udemy Plan Cost")) {
      setup.udemy_cost = String(value);
    } else if (label.includes("Monthly Expense Budget")) {
      setup.monthly_budget = String(value);
    } else if (label.includes("Savings Goal")) {
      setup.savings_goal = String(value);
    } else if (label.includes("Your Name")) {
      setup.name = String(value);
    }
  }

  return setup;
}
