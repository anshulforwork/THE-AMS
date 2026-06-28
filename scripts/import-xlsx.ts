/**
 * One-time import script: reads AMS_Life_Tracker xlsx and imports daily logs to local storage.
 * Run: npm run import:xlsx
 */
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { parseDailyLogRows, parseSetupFromRows } from "../src/lib/import-xlsx";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

async function main() {
  const candidates = [
    path.join(process.cwd(), "..", "AMS_Life_Tracker_2026-27 (1).xlsx"),
    path.join(process.cwd(), "AMS_Life_Tracker_2026-27 (1).xlsx"),
  ];

  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) {
    console.error("Excel file not found. Place AMS_Life_Tracker_2026-27 (1).xlsx in project root.");
    process.exit(1);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames.find((n) =>
    n.toLowerCase().includes("daily input")
  );

  if (!sheetName) {
    console.error("Daily Input sheet not found");
    process.exit(1);
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
  const logs = parseDailyLogRows(rows);
  const setupRaw = parseSetupFromRows(rows);

  let store: Record<string, unknown> = {};
  if (fs.existsSync(STORE_PATH)) {
    store = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  }

  store.dailyLogs = logs;

  if (Object.keys(setupRaw).length > 0) {
    store.setup = {
      name: setupRaw.name ?? "Anshul Sahu",
      monthlyIncome: Number(setupRaw.monthly_income) || 30000,
      udemyCost: Number(setupRaw.udemy_cost) || 4800,
      monthlyBudget: Number(setupRaw.monthly_budget) || 25000,
      savingsGoal: Number(setupRaw.savings_goal) || 100000,
    };
  }

  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));

  console.log(`Imported ${logs.length} daily log entries to ${STORE_PATH}`);
  if (Object.keys(setupRaw).length > 0) {
    console.log("Setup values:", setupRaw);
  }
}

main().catch(console.error);
