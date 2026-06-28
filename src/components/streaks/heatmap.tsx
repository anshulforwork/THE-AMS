"use client";

import { cn } from "@/lib/utils";

interface HeatmapProps {
  data: Record<string, number>;
  weeks?: number;
}

export function StreakHeatmap({ data, weeks = 26 }: HeatmapProps) {
  const today = new Date();
  const cells: { date: string; count: number }[] = [];

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: key, count: data[key] ?? 0 });
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-white/5";
    if (count === 1) return "bg-violet-900/60";
    if (count === 2) return "bg-violet-700/70";
    return "bg-violet-500";
  };

  return (
    <div className="overflow-x-auto">
      <div
        className="inline-grid gap-1"
        style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
      >
        {cells.map(({ date, count }) => (
          <div
            key={date}
            title={`${date}: ${count > 0 ? "Checked in" : "No check-in"}`}
            className={cn("h-3 w-3 rounded-sm", getColor(count))}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
        <span>Less</span>
        {[0, 1, 2, 3].map((level) => (
          <div key={level} className={cn("h-3 w-3 rounded-sm", getColor(level))} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
