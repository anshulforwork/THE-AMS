"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Dumbbell, PenLine, Pencil, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { DailyLog } from "@/lib/types";

export default function HistoryPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/daily-log")
      .then((r) => r.json())
      .then((data: DailyLog[]) => setLogs(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filled = useMemo(
    () =>
      logs
        .filter((l) => l.learnHrs > 0 || l.expense > 0 || l.mood > 0 || l.keyLearning || l.journalText)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [logs]
  );

  const months = useMemo(() => {
    const set = new Set(filled.map((l) => l.date.slice(0, 7)));
    return [...set].sort().reverse();
  }, [filled]);

  const filtered = filled.filter((l) => {
    if (month !== "all" && !l.date.startsWith(month)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.course.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.keyLearning.toLowerCase().includes(q) ||
        l.journalText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totals = filtered.reduce(
    (acc, l) => ({
      hrs: acc.hrs + l.learnHrs,
      spent: acc.spent + l.expense,
      days: acc.days + 1,
    }),
    { hrs: 0, spent: 0, days: 0 }
  );

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-zinc-400">Loading history...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">History</h1>
        <p className="text-zinc-400">Browse and edit every past day you&apos;ve logged</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-sm text-zinc-400">Days Logged</p><p className="text-2xl font-bold">{totals.days}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-zinc-400">Total Learn Hrs</p><p className="text-2xl font-bold text-violet-400">{totals.hrs.toFixed(1)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-zinc-400">Total Spent</p><p className="text-2xl font-bold text-red-400">{formatCurrency(totals.spent)}</p></CardContent></Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search course, category, notes..." className="pl-10" />
        </div>
        <Select value={month} onChange={(e) => setMonth(e.target.value)} className="sm:w-48">
          <option value="all">All months</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(m + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-zinc-400">
                <th className="p-3">Date</th>
                <th className="p-3">Course</th>
                <th className="p-3">Hrs</th>
                <th className="p-3">Expense</th>
                <th className="p-3">Category</th>
                <th className="p-3">Mood</th>
                <th className="p-3">Prod</th>
                <th className="p-3"></th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.date} className="border-b border-white/5 text-zinc-300 hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap p-3">{formatDate(l.date)}</td>
                  <td className="max-w-[160px] truncate p-3">{l.course || "—"}</td>
                  <td className="p-3">{l.learnHrs || "—"}</td>
                  <td className="whitespace-nowrap p-3">{l.expense ? formatCurrency(l.expense) : "—"}</td>
                  <td className="p-3">{l.category || "—"}</td>
                  <td className="p-3">{l.mood || "—"}</td>
                  <td className="p-3">{l.productivity || "—"}</td>
                  <td className="p-3">
                    <span className="flex gap-1.5 text-zinc-500">
                      {l.exercise && <Dumbbell className="h-3.5 w-3.5 text-emerald-400" />}
                      {l.journalDone && <PenLine className="h-3.5 w-3.5 text-amber-400" />}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link href={`/check-in?date=${l.date}`} className="text-violet-400 hover:text-violet-300">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-zinc-500">No entries match your filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
