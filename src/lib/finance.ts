import type { FinancePlanEntry } from "./types";
import { parseNumber } from "./utils";

export interface PhaseConfig {
  salary: number;
  rd1: number;
  rd2: number;
  expenses: number;
  months: number;
}

export interface MonthRow {
  month: number;
  salary: number;
  rd1: number;
  rd2: number;
  expenses: number;
  buffer: number;
  cumulative: number;
  phase: string;
}

export interface CorpusProjection {
  rd1Year1: number;
  rd1Year2: number;
  rd2: number;
  fdFull: number;
  fdPartial: number;
  totalBuffer: number;
  totalCorpus: number;
  months: MonthRow[];
}

export interface ResilienceLayer {
  layer: string;
  value: number;
  description: string;
  rule: string;
}

function rdMaturity(monthly: number, months: number, rate: number): number {
  if (monthly <= 0 || months <= 0) return 0;
  return monthly * months * (1 + (rate * (months + 1)) / (2 * months));
}

export function getPhases(plan: Record<string, string>): [PhaseConfig, PhaseConfig, PhaseConfig] {
  return [
    {
      salary: parseNumber(plan.p1_salary, 29000),
      rd1: parseNumber(plan.p1_rd1, 15000),
      rd2: parseNumber(plan.p1_rd2, 0),
      expenses: parseNumber(plan.p1_expenses, 7000),
      months: parseNumber(plan.p1_months, 3),
    },
    {
      salary: parseNumber(plan.p2_salary, 29000),
      rd1: parseNumber(plan.p2_rd1, 15000),
      rd2: parseNumber(plan.p2_rd2, 5000),
      expenses: parseNumber(plan.p2_expenses, 7000),
      months: parseNumber(plan.p2_months, 9),
    },
    {
      salary: parseNumber(plan.p3_salary, 40000),
      rd1: parseNumber(plan.p3_rd1, 20000),
      rd2: parseNumber(plan.p3_rd2, 5000),
      expenses: parseNumber(plan.p3_expenses, 7000),
      months: parseNumber(plan.p3_months, 12),
    },
  ];
}

const PHASE_NAMES = [
  "Phase 1 – Build RD Habit",
  "Phase 2 – 2nd RD Active",
  "Phase 3 – Year 2 Growth",
];

export function computeCorpus(plan: Record<string, string>): CorpusProjection {
  const phases = getPhases(plan);
  const rdRate = parseNumber(plan.rd_rate, 0.065);
  const fdRate = parseNumber(plan.fd_rate, 0.068);

  const months: MonthRow[] = [];
  let cumulative = 0;
  let monthNum = 0;

  phases.forEach((phase, pi) => {
    for (let i = 0; i < phase.months; i++) {
      monthNum++;
      const buffer = phase.salary - phase.rd1 - phase.rd2 - phase.expenses;
      cumulative += buffer;
      months.push({
        month: monthNum,
        salary: phase.salary,
        rd1: phase.rd1,
        rd2: phase.rd2,
        expenses: phase.expenses,
        buffer,
        cumulative,
        phase: PHASE_NAMES[pi],
      });
    }
  });

  // Year-1 RD#1 maturity (12 months at the phase-1/2 rate)
  const rd1Year1 = rdMaturity(phases[1].rd1, 12, rdRate);
  // Year-2 RD#1 maturity (phase-3, 12 months)
  const rd1Year2 = rdMaturity(phases[2].rd1, 12, rdRate);
  // RD#2 across the months it is active
  const rd2ActiveMonths = months.filter((m) => m.rd2 > 0).length;
  const rd2Monthly = phases[2].rd2 || phases[1].rd2;
  const rd2 = rdMaturity(rd2Monthly, rd2ActiveMonths, rdRate);

  const fdPrincipal = rd1Year1;
  const fdFull = fdPrincipal * (1 + fdRate);
  const fdPartial = fdPrincipal * (1 + fdRate * (11 / 12));
  const totalBuffer = cumulative;

  return {
    rd1Year1,
    rd1Year2,
    rd2,
    fdFull,
    fdPartial,
    totalBuffer,
    totalCorpus: rd1Year2 + rd2 + fdPartial + totalBuffer,
    months,
  };
}

export function getResilienceLayers(
  plan: Record<string, string>,
  corpus: CorpusProjection
): ResilienceLayer[] {
  const phases = getPhases(plan);
  const monthlyBuffer = phases[2].salary - phases[2].rd1 - phases[2].rd2 - phases[2].expenses;

  return [
    {
      layer: "Layer 1 — Monthly Buffer",
      value: monthlyBuffer,
      description: "Monthly surplus after all deductions",
      rule: "Break this first. No guilt.",
    },
    {
      layer: "Layer 2 — RD #2",
      value: corpus.rd2,
      description: "Sacrificial RD (₹5k/month)",
      rule: "Pause or break if Layer 1 gone.",
    },
    {
      layer: "Layer 3 — RD #1",
      value: corpus.rd1Year1,
      description: "Core RD — Year 1 maturity",
      rule: "Touch only if serious need.",
    },
    {
      layer: "Layer 4 — FD",
      value: corpus.fdPartial,
      description: "FD corpus at Month 24",
      rule: "Last resort. Let it compound.",
    },
  ];
}

export function planToRecord(entries: FinancePlanEntry[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (const e of entries) record[e.key] = e.value;
  return record;
}

/** Editable input fields, grouped for the UI */
export const FINANCE_INPUT_GROUPS: {
  group: string;
  fields: { key: string; label: string }[];
}[] = [
  {
    group: "Phase 1 — Build RD Habit",
    fields: [
      { key: "p1_salary", label: "Monthly Salary (₹)" },
      { key: "p1_rd1", label: "RD #1 / month (₹)" },
      { key: "p1_rd2", label: "RD #2 / month (₹)" },
      { key: "p1_expenses", label: "Monthly Expenses (₹)" },
      { key: "p1_months", label: "Duration (months)" },
    ],
  },
  {
    group: "Phase 2 — 2nd RD Active",
    fields: [
      { key: "p2_salary", label: "Monthly Salary (₹)" },
      { key: "p2_rd1", label: "RD #1 / month (₹)" },
      { key: "p2_rd2", label: "RD #2 / month (₹)" },
      { key: "p2_expenses", label: "Monthly Expenses (₹)" },
      { key: "p2_months", label: "Duration (months)" },
    ],
  },
  {
    group: "Phase 3 — Year 2 Growth",
    fields: [
      { key: "p3_salary", label: "Monthly Salary (₹)" },
      { key: "p3_rd1", label: "RD #1 / month (₹)" },
      { key: "p3_rd2", label: "RD #2 / month (₹)" },
      { key: "p3_expenses", label: "Monthly Expenses (₹)" },
      { key: "p3_months", label: "Duration (months)" },
    ],
  },
  {
    group: "Rates & Targets",
    fields: [
      { key: "rd_rate", label: "RD Interest Rate (e.g. 0.065)" },
      { key: "fd_rate", label: "FD Interest Rate (e.g. 0.068)" },
      { key: "fd_target", label: "Next-Year FD Target (₹)" },
    ],
  },
];

export const DEFAULT_FINANCE_PLAN: FinancePlanEntry[] = [
  { key: "p1_salary", value: "29000", notes: "Phase 1 monthly salary" },
  { key: "p1_rd1", value: "15000", notes: "Phase 1 RD #1" },
  { key: "p1_rd2", value: "0", notes: "Phase 1 RD #2" },
  { key: "p1_expenses", value: "7000", notes: "Phase 1 expenses" },
  { key: "p1_months", value: "3", notes: "Phase 1 duration" },
  { key: "p2_salary", value: "29000", notes: "Phase 2 monthly salary" },
  { key: "p2_rd1", value: "15000", notes: "Phase 2 RD #1" },
  { key: "p2_rd2", value: "5000", notes: "Phase 2 RD #2" },
  { key: "p2_expenses", value: "7000", notes: "Phase 2 expenses" },
  { key: "p2_months", value: "9", notes: "Phase 2 duration" },
  { key: "p3_salary", value: "40000", notes: "Phase 3 monthly salary" },
  { key: "p3_rd1", value: "20000", notes: "Phase 3 RD #1" },
  { key: "p3_rd2", value: "5000", notes: "Phase 3 RD #2" },
  { key: "p3_expenses", value: "7000", notes: "Phase 3 expenses" },
  { key: "p3_months", value: "12", notes: "Phase 3 duration" },
  { key: "rd_rate", value: "0.065", notes: "RD annual rate" },
  { key: "fd_rate", value: "0.068", notes: "FD annual rate" },
  { key: "fd_target", value: "250000", notes: "Next-year FD target" },
];
