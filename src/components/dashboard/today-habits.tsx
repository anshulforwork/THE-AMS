"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HabitWithStats } from "@/lib/types";

export function TodayHabits() {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const data = await fetch("/api/habits").then((r) => r.json());
    setHabits(Array.isArray(data) ? data : []);
    setLoaded(true);
  }

  useEffect(() => { load(); }, []);

  async function toggle(id: string) {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, doneToday: !h.doneToday } : h))
    );
    await fetch("/api/habits/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id }),
    });
    load();
  }

  if (!loaded || habits.length === 0) return null;

  const done = habits.filter((h) => h.doneToday).length;

  return (
    <Card>
      <div className="flex items-center justify-between p-5 pb-2">
        <p className="text-base font-semibold text-white">Today&apos;s Habits ({done}/{habits.length})</p>
        <Link href="/habits" className="flex items-center text-sm text-violet-400 hover:text-violet-300">
          All habits <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <CardContent className="flex flex-wrap gap-2">
        {habits.map((h) => (
          <button
            key={h.id}
            onClick={() => toggle(h.id)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all",
              h.doneToday
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-white/10 text-zinc-400 hover:border-violet-500/50"
            )}
          >
            {h.doneToday ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            {h.name}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
