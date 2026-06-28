"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy, Calendar } from "lucide-react";
import { StreakHeatmap } from "@/components/streaks/heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StreakStats } from "@/lib/types";

export default function StreaksPage() {
  const [stats, setStats] = useState<StreakStats | null>(null);

  useEffect(() => {
    fetch("/api/streak").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return <div className="flex h-64 items-center justify-center text-zinc-400">Loading streaks...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Streaks</h1>
        <p className="text-zinc-400">Your daily presence record — consistency builds greatness</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-orange-500/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-orange-500/20 p-3">
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.current}</p>
              <p className="text-sm text-zinc-400">Current Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-yellow-500/20 p-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.longest}</p>
              <p className="text-sm text-zinc-400">Longest Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-violet-500/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-violet-500/20 p-3">
              <Calendar className="h-8 w-8 text-violet-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.totalCheckins}</p>
              <p className="text-sm text-zinc-400">Total Check-ins</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Presence Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <StreakHeatmap data={stats.heatmap} weeks={26} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Streak Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-400">
          <p>Check in every day, even on low-energy days — a 5-minute entry counts.</p>
          <p>Your streak resets if you miss a full calendar day. Plan your check-in before midnight.</p>
          <p>Pair check-ins with a habit you already have (morning coffee, before bed).</p>
        </CardContent>
      </Card>
    </div>
  );
}
