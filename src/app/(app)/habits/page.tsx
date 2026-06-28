"use client";

import { useEffect, useState } from "react";
import {
  BookOpen, Check, Circle, Dumbbell, Flame, Moon, PenLine,
  Plus, Trash2, Wallet, Droplet, Heart, Brain, Sun, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, toDateKey } from "@/lib/utils";
import type { HabitWithStats } from "@/lib/types";

const ICONS: Record<string, typeof Circle> = {
  BookOpen, Dumbbell, PenLine, Wallet, Moon, Droplet, Heart, Brain, Sun, Circle,
};
const ICON_OPTIONS = Object.keys(ICONS);

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "Circle" });

  async function load() {
    const data = await fetch("/api/habits").then((r) => r.json());
    setHabits(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggle(habitId: string) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? { ...h, doneToday: !h.doneToday, current: h.doneToday ? Math.max(0, h.current - 1) : h.current + 1 }
          : h
      )
    );
    await fetch("/api/habits/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId }),
    });
    load();
  }

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", icon: "Circle" });
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    await fetch(`/api/habits?id=${id}`, { method: "DELETE" });
  }

  const doneCount = habits.filter((h) => h.doneToday).length;

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-zinc-400">Loading habits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Habits</h1>
          <p className="text-zinc-400">{doneCount}/{habits.length} done today — tap to check off</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Add Habit
        </Button>
      </div>

      {habits.length > 0 && (
        <Card className="border-violet-500/20 bg-gradient-to-r from-violet-950/30 to-transparent">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Trophy className="h-7 w-7 text-violet-400" />
              <div>
                <p className="font-semibold text-white">Today&apos;s progress</p>
                <p className="text-sm text-zinc-400">{doneCount} of {habits.length} habits complete</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-violet-300">
              {habits.length > 0 ? Math.round((doneCount / habits.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Habit</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={addHabit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Meditate 10 min" required />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                  {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </Select>
              </div>
              <Button type="submit" className="sm:col-span-2">Create Habit</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {habits.map((habit) => {
          const Icon = ICONS[habit.icon] ?? Circle;
          return (
            <Card key={habit.id} className={cn(habit.doneToday && "border-emerald-500/30 bg-emerald-950/10")}>
              <CardContent className="flex items-center gap-4 p-4">
                <button
                  onClick={() => toggle(habit.id)}
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-all",
                    habit.doneToday
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-white/15 text-zinc-400 hover:border-violet-500"
                  )}
                >
                  {habit.doneToday ? <Check className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                </button>
                <div className="flex-1">
                  <p className="font-medium text-white">{habit.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1 text-orange-400">
                      <Flame className="h-3 w-3" /> {habit.current} day
                    </span>
                    <span>Best: {habit.longest}</span>
                  </div>
                  <div className="mt-2 flex gap-0.5">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const key = toDateKey(new Date(Date.now() - (29 - i) * 86400000));
                      const done = habit.last30.includes(key);
                      return (
                        <div
                          key={i}
                          className={cn("h-2 flex-1 rounded-sm", done ? "bg-emerald-500" : "bg-white/5")}
                        />
                      );
                    })}
                  </div>
                </div>
                <button onClick={() => remove(habit.id)} className="text-zinc-600 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {habits.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            No habits yet. Add daily habits to build streaks and track your presence.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
