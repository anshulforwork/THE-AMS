"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { DailyLog } from "@/lib/types";

export default function JournalPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/daily-log").then((r) => r.json()).then(setLogs);
  }, []);

  const journalEntries = logs
    .filter((l) => l.journalText || l.keyLearning)
    .sort((a, b) => b.date.localeCompare(a.date));

  const filtered = search
    ? journalEntries.filter(
        (l) =>
          l.journalText.toLowerCase().includes(search.toLowerCase()) ||
          l.keyLearning.toLowerCase().includes(search.toLowerCase()) ||
          l.course.toLowerCase().includes(search.toLowerCase())
      )
    : journalEntries;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Journal</h1>
        <p className="text-zinc-400">Searchable log of reflections and key learnings</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search journal entries..."
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((entry) => (
          <Card key={entry.date}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{formatDate(entry.date)}</CardTitle>
                <div className="flex gap-2 text-xs text-zinc-500">
                  {entry.mood > 0 && <span>Mood: {entry.mood}/10</span>}
                  {entry.course && <span>· {entry.course}</span>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {entry.keyLearning && (
                <p className="text-sm font-medium text-violet-300">
                  💡 {entry.keyLearning}
                </p>
              )}
              {entry.journalText && (
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{entry.journalText}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            {search ? "No entries match your search." : "No journal entries yet. Add reflections in Daily Check-in."}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
