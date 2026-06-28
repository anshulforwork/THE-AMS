"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Settings2, Trash2 } from "lucide-react";
import { Badge, ProgressBar } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FINANCE_INPUT_GROUPS } from "@/lib/finance";
import { cn, formatCurrency } from "@/lib/utils";
import type { FinancePlanEntry } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface BudgetWithSpent {
  id: string;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  pctUsed: number;
}

interface FinanceData {
  setup: { monthlyIncome: number; monthlyBudget: number; savingsGoal: number };
  totalSpent: number;
  savingsRate: number;
  categories: { category: string; amount: number }[];
  corpus: {
    rd1Year1: number; rd1Year2: number; rd2: number;
    fdPartial: number; fdFull: number; totalBuffer: number; totalCorpus: number;
    months: { month: number; salary: number; rd1: number; rd2: number; expenses: number; buffer: number; cumulative: number; phase: string }[];
  };
  layers: { layer: string; value: number; description: string; rule: string }[];
  financePlan: FinancePlanEntry[];
  budgets: BudgetWithSpent[];
}

const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6", "#a855f7", "#eab308"];

export default function FinancePage() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [editPlan, setEditPlan] = useState(false);
  const [planValues, setPlanValues] = useState<Record<string, string>>({});
  const [showMonths, setShowMonths] = useState(false);
  const [newCat, setNewCat] = useState({ category: "", budget: 0 });
  const [showAddCat, setShowAddCat] = useState(false);

  async function load() {
    const d = await fetch("/api/finance").then((r) => r.json());
    setData(d);
    const map: Record<string, string> = {};
    for (const e of d.financePlan as FinancePlanEntry[]) map[e.key] = e.value;
    setPlanValues(map);
  }
  useEffect(() => { load(); }, []);

  async function savePlan() {
    if (!data) return;
    const entries = data.financePlan.map((e) => ({ ...e, value: planValues[e.key] ?? e.value }));
    await fetch("/api/finance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });
    setEditPlan(false);
    load();
  }

  async function saveBudget(b: BudgetWithSpent, budget: number) {
    await fetch("/api/budgets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, category: b.category, budget }),
    });
    load();
  }

  async function addBudget(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    setNewCat({ category: "", budget: 0 });
    setShowAddCat(false);
    load();
  }

  async function removeBudget(id: string) {
    setData((prev) => prev ? { ...prev, budgets: prev.budgets.filter((b) => b.id !== id) } : prev);
    await fetch(`/api/budgets?id=${id}`, { method: "DELETE" });
    load();
  }

  if (!data) {
    return <div className="flex h-64 items-center justify-center text-zinc-400">Loading finance...</div>;
  }

  const totalBudget = data.budgets.reduce((s, b) => s + b.budget, 0);
  const totalCatSpent = data.budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Finance</h1>
        <p className="text-zinc-400">Budgets, spending, and your 24-month corpus plan</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-400">Monthly Income</p><p className="text-2xl font-bold text-emerald-400">{formatCurrency(data.setup.monthlyIncome)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-400">Total Spent</p><p className="text-2xl font-bold text-red-400">{formatCurrency(data.totalSpent)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-400">Savings Rate</p><p className="text-2xl font-bold text-violet-400">{data.savingsRate.toFixed(1)}%</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-400">Savings Goal</p><p className="text-2xl font-bold text-white">{formatCurrency(data.setup.savingsGoal)}</p></CardContent></Card>
      </div>

      {/* Budget categories */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Category Budgets</CardTitle>
            <p className="text-sm text-zinc-500">Spent {formatCurrency(totalCatSpent)} of {formatCurrency(totalBudget)} budgeted</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowAddCat(!showAddCat)}>
            <Plus className="h-4 w-4" /> Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {showAddCat && (
            <form onSubmit={addBudget} className="flex flex-wrap items-end gap-2 rounded-xl border border-white/10 p-3">
              <div className="space-y-1">
                <Label>Category name</Label>
                <Input value={newCat.category} onChange={(e) => setNewCat({ ...newCat, category: e.target.value })} placeholder="e.g. Health" required />
              </div>
              <div className="space-y-1">
                <Label>Budget (₹)</Label>
                <Input type="number" value={newCat.budget} onChange={(e) => setNewCat({ ...newCat, budget: Number(e.target.value) })} />
              </div>
              <Button type="submit" size="sm">Add</Button>
            </form>
          )}
          {data.budgets.map((b) => {
            const over = b.pctUsed > 100;
            const watch = b.pctUsed > 85 && b.pctUsed <= 100;
            return (
              <div key={b.id} className="rounded-xl border border-white/5 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{b.category}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(over ? "border-red-500/30 text-red-400" : watch ? "border-amber-500/30 text-amber-400" : "border-emerald-500/30 text-emerald-400")}>
                      {over ? "Over" : watch ? "Watch" : "OK"}
                    </Badge>
                    <button onClick={() => removeBudget(b.id)} className="text-zinc-600 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar value={Math.min(100, b.pctUsed)} />
                  </div>
                  <span className="w-32 text-right text-sm text-zinc-400">
                    {formatCurrency(b.spent)} / 
                    <input
                      type="number"
                      defaultValue={b.budget}
                      onBlur={(e) => { const v = Number(e.target.value); if (v !== b.budget) saveBudget(b, v); }}
                      className="ml-1 w-16 rounded bg-white/5 px-1 text-right text-white outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </span>
                </div>
              </div>
            );
          })}
          {data.budgets.length === 0 && <p className="py-4 text-center text-sm text-zinc-500">No budget categories yet.</p>}
        </CardContent>
      </Card>

      {data.categories.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categories} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={90}
                  label={(props) => {
                    const e = props as { category?: string; amount?: number; name?: string; value?: number };
                    return `${e.category ?? e.name ?? ""}: ${formatCurrency(e.amount ?? e.value ?? 0)}`;
                  }}>
                  {data.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ background: "#18181b", border: "1px solid #ffffff20", borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Corpus projection */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>24-Month Corpus Projection</CardTitle>
          <Button variant="secondary" size="sm" onClick={() => setEditPlan(!editPlan)}>
            <Settings2 className="h-4 w-4" /> {editPlan ? "Close" : "Edit Plan"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {editPlan && (
            <div className="space-y-4 rounded-xl border border-white/10 p-4">
              {FINANCE_INPUT_GROUPS.map((g) => (
                <div key={g.group}>
                  <p className="mb-2 text-sm font-semibold text-violet-300">{g.group}</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {g.fields.map((f) => (
                      <div key={f.key} className="space-y-1">
                        <Label className="text-xs">{f.label}</Label>
                        <Input
                          value={planValues[f.key] ?? ""}
                          onChange={(e) => setPlanValues({ ...planValues, [f.key]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button onClick={savePlan}>Save Plan</Button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="RD #1 Year 1" value={data.corpus.rd1Year1} />
            <Stat label="RD #1 Year 2" value={data.corpus.rd1Year2} />
            <Stat label="RD #2 (Sacrificial)" value={data.corpus.rd2} />
            <Stat label="FD @ 11 months" value={data.corpus.fdPartial} />
            <Stat label="Total Buffer" value={data.corpus.totalBuffer} />
            <div className="rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-4">
              <p className="text-sm text-zinc-400">Total Corpus @ M24</p>
              <p className="text-xl font-bold text-violet-300">{formatCurrency(data.corpus.totalCorpus)}</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowMonths(!showMonths)}>
            {showMonths ? "Hide" : "Show"} month-by-month tracker
          </Button>
          {showMonths && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-zinc-400">
                    <th className="p-2">Mo</th><th className="p-2">Salary</th><th className="p-2">RD#1</th>
                    <th className="p-2">RD#2</th><th className="p-2">Expenses</th><th className="p-2">Buffer</th>
                    <th className="p-2">Cumulative</th><th className="p-2">Phase</th>
                  </tr>
                </thead>
                <tbody>
                  {data.corpus.months.map((m) => (
                    <tr key={m.month} className="border-b border-white/5 text-zinc-300">
                      <td className="p-2">{m.month}</td>
                      <td className="p-2">{formatCurrency(m.salary)}</td>
                      <td className="p-2">{formatCurrency(m.rd1)}</td>
                      <td className="p-2">{formatCurrency(m.rd2)}</td>
                      <td className="p-2">{formatCurrency(m.expenses)}</td>
                      <td className="p-2">{formatCurrency(m.buffer)}</td>
                      <td className="p-2 font-medium text-violet-300">{formatCurrency(m.cumulative)}</td>
                      <td className="whitespace-nowrap p-2 text-xs text-zinc-500">{m.phase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>4-Layer Emergency Resilience</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.layers.map((layer, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border border-white/5 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-sm font-bold text-violet-400">{i + 1}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{layer.layer}</p>
                  <p className="font-bold text-emerald-400">{formatCurrency(layer.value)}</p>
                </div>
                <p className="text-sm text-zinc-400">{layer.description}</p>
                <p className="mt-1 text-xs text-zinc-500">{layer.rule}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-xl font-bold">{formatCurrency(value)}</p>
    </div>
  );
}
