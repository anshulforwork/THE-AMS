import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { parseDailyLogRows, parseSetupFromRows } from "@/lib/import-xlsx";
import { getStorage } from "@/lib/storage";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const candidates = [
    path.join(process.cwd(), "..", "AMS_Life_Tracker_2026-27 (1).xlsx"),
    path.join(process.cwd(), "AMS_Life_Tracker_2026-27 (1).xlsx"),
  ];

  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) {
    return NextResponse.json(
      { error: "Excel file not found. Place AMS_Life_Tracker_2026-27 (1).xlsx in project root." },
      { status: 404 }
    );
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames.find((n) =>
    n.toLowerCase().includes("daily input")
  );

  if (!sheetName) {
    return NextResponse.json({ error: "Daily Input sheet not found" }, { status: 400 });
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
  const logs = parseDailyLogRows(rows);
  const setupRaw = parseSetupFromRows(rows);

  if (logs.length === 0) {
    return NextResponse.json({ error: "No daily log data found in Excel file" }, { status: 400 });
  }

  const storage = getStorage();
  await storage.bulkImportDailyLogs(logs);

  if (Object.keys(setupRaw).length > 0) {
    await storage.updateSetup({
      name: setupRaw.name ?? "Anshul Sahu",
      monthlyIncome: Number(setupRaw.monthly_income) || 30000,
      udemyCost: Number(setupRaw.udemy_cost) || 4800,
      monthlyBudget: Number(setupRaw.monthly_budget) || 25000,
      savingsGoal: Number(setupRaw.savings_goal) || 100000,
    });
  }

  return NextResponse.json({ success: true, imported: logs.length, setup: setupRaw });
}
