import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { expensesByCategory } from "@/lib/analytics";
import { computeCorpus, getResilienceLayers, planToRecord } from "@/lib/finance";
import { getStorage } from "@/lib/storage";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const storage = getStorage();
  const [logs, setup, financePlan, budgets] = await Promise.all([
    storage.getDailyLogs(),
    storage.getSetup(),
    storage.getFinancePlan(),
    storage.getBudgets(),
  ]);

  const plan = planToRecord(financePlan);
  const corpus = computeCorpus(plan);
  const layers = getResilienceLayers(plan, corpus);
  const categories = expensesByCategory(logs);

  // Spent per category (case-insensitive match), summed across all logs
  const spentByCat: Record<string, number> = {};
  for (const log of logs) {
    if (log.expense > 0) {
      const key = (log.category || "other").toLowerCase();
      spentByCat[key] = (spentByCat[key] ?? 0) + log.expense;
    }
  }
  const budgetsWithSpent = budgets.map((b) => {
    const spent = spentByCat[b.category.toLowerCase()] ?? 0;
    return {
      ...b,
      spent,
      remaining: b.budget - spent,
      pctUsed: b.budget > 0 ? (spent / b.budget) * 100 : 0,
    };
  });

  const totalSpent = logs.reduce((s, l) => s + l.expense, 0);
  const monthsWithData = Math.max(1, new Set(logs.map((l) => l.date.slice(0, 7))).size);
  const savingsRate = setup.monthlyIncome > 0
    ? ((setup.monthlyIncome - totalSpent / monthsWithData) / setup.monthlyIncome) * 100
    : 0;

  return NextResponse.json({
    setup,
    totalSpent,
    savingsRate,
    categories,
    corpus,
    layers,
    financePlan,
    budgets: budgetsWithSpent,
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  await getStorage().upsertFinancePlan(body.entries);
  return NextResponse.json({ success: true });
}
