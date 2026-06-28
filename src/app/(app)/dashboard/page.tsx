"use client";

import { useEffect, useState } from "react";
import {
  Activity, BookOpen, Brain, Flame, PiggyBank, Target, TrendingUp, Wallet,
} from "lucide-react";
import { KpiCard, KpiCurrency } from "@/components/dashboard/kpi-card";
import { TodayHabits } from "@/components/dashboard/today-habits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { quoteOfTheDay } from "@/lib/quotes";
import type { DashboardStats } from "@/lib/types";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats & { name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-zinc-400">Loading dashboard...</div>;
  }

  if (!stats) return null;

  const quote = quoteOfTheDay();
  const chartData = stats.monthlySummary
    .filter((m) => m.learnHrs > 0 || m.expense > 0)
    .map((m) => ({
      month: m.month.slice(5),
      learnHrs: m.learnHrs,
      expense: m.expense,
      mood: Number(m.moodAvg.toFixed(1)),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">
          Welcome back, {stats.name?.split(" ")[0] ?? "Anshul"}
        </h1>
        <p className="text-zinc-400">Your life command center — everything at a glance</p>
      </div>

      <Card className="border-violet-500/10 bg-gradient-to-r from-violet-950/20 to-transparent">
        <CardContent className="p-5">
          <p className="text-base italic text-zinc-200">&ldquo;{quote.text}&rdquo;</p>
          <p className="mt-1 text-sm text-violet-400">— {quote.author}</p>
        </CardContent>
      </Card>

      <TodayHabits />

      {stats.currentStreak > 0 && (
        <Card className="border-orange-500/20 bg-gradient-to-r from-orange-950/30 to-transparent">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-orange-500/20 p-3">
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-300">{stats.currentStreak} day streak!</p>
              <p className="text-sm text-zinc-400">Longest: {stats.longestStreak} days · Keep showing up</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCurrency title="Monthly Income" amount={stats.monthlyIncome} icon={Wallet} accent="from-emerald-600 to-teal-600" />
        <KpiCurrency title="Total Spent" amount={stats.totalSpent} icon={PiggyBank} accent="from-red-600 to-orange-600" />
        <KpiCard title="Savings Rate" value={`${stats.savingsRate.toFixed(1)}%`} icon={TrendingUp} accent="from-blue-600 to-cyan-600" />
        <KpiCard title="ROI Multiple" value={`${stats.roiMultiple.toFixed(1)}x`} subtitle="Udemy investment return" icon={Target} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Learn Hours" value={stats.totalLearnHrs.toFixed(1)} subtitle={`${stats.daysStudied} days studied`} icon={BookOpen} />
        <KpiCard title="Avg Mood" value={`${stats.avgMood.toFixed(1)}/10`} icon={Brain} accent="from-pink-600 to-rose-600" />
        <KpiCard title="Avg Productivity" value={`${stats.avgProductivity.toFixed(1)}/10`} icon={Activity} accent="from-violet-600 to-purple-600" />
        <KpiCard title="Exercise Days" value={stats.exerciseDays} icon={Flame} accent="from-amber-600 to-yellow-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning Hours by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #ffffff20", borderRadius: 12 }} />
                <Bar dataKey="learnHrs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #ffffff20", borderRadius: 12 }} />
                <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Month-by-Month Summary</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-zinc-400">
                <th className="pb-3 pr-4">Month</th>
                <th className="pb-3 pr-4">Learn Hrs</th>
                <th className="pb-3 pr-4">Days Studied</th>
                <th className="pb-3 pr-4">Expense</th>
                <th className="pb-3 pr-4">Mood</th>
                <th className="pb-3 pr-4">Prod</th>
                <th className="pb-3">Streak</th>
              </tr>
            </thead>
            <tbody>
              {stats.monthlySummary.map((m) => (
                <tr key={m.month} className="border-b border-white/5 text-zinc-300">
                  <td className="py-2 pr-4">{m.month}</td>
                  <td className="py-2 pr-4">{m.learnHrs.toFixed(1)}</td>
                  <td className="py-2 pr-4">{m.daysStudied}</td>
                  <td className="py-2 pr-4">{formatCurrency(m.expense)}</td>
                  <td className="py-2 pr-4">{m.moodAvg > 0 ? m.moodAvg.toFixed(1) : "—"}</td>
                  <td className="py-2 pr-4">{m.prodAvg > 0 ? m.prodAvg.toFixed(1) : "—"}</td>
                  <td className="py-2">{m.streak || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
