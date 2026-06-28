"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const CATEGORIES = ["FOOD", "Transport", "Rent", "Bills", "Investment", "Fun", "Skill Dev", "Emergency", "other"];

const EMPTY = {
  learnHrs: 0,
  course: "",
  expense: 0,
  category: "FOOD",
  mood: 5,
  productivity: 5,
  exercise: false,
  journalDone: false,
  keyLearning: "",
  journalText: "",
};

export default function CheckInPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const [form, setForm] = useState({ date: today, ...EMPTY });

  function loadForDate(date: string) {
    fetch("/api/daily-log")
      .then((r) => r.json())
      .then((logs: Array<typeof form>) => {
        const existing = logs.find((l) => l.date === date);
        if (existing) {
          setIsExisting(true);
          setForm({
            date,
            learnHrs: existing.learnHrs ?? 0,
            course: existing.course ?? "",
            expense: existing.expense ?? 0,
            category: existing.category || "FOOD",
            mood: existing.mood ?? 5,
            productivity: existing.productivity ?? 5,
            exercise: existing.exercise ?? false,
            journalDone: existing.journalDone ?? false,
            keyLearning: existing.keyLearning ?? "",
            journalText: existing.journalText ?? "",
          });
        } else {
          setIsExisting(false);
          setForm({ date, ...EMPTY });
        }
      });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlDate = params.get("date");
    loadForDate(urlDate && /^\d{4}-\d{2}-\d{2}$/.test(urlDate) ? urlDate : today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeDate(date: string) {
    loadForDate(date);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await fetch("/api/daily-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    setSaved(true);
    setIsExisting(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const isToday = form.date === today;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Daily Check-in</h1>
        <p className="text-zinc-400">
          {isToday ? "Fill once per day — your streak depends on it" : "Editing a past day"}
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-4 text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
          Saved! Streak updated.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Date</CardTitle>
            <CardDescription>
              {isExisting ? "An entry exists for this date — you're editing it." : "Pick any date to log or backfill."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              max={today}
              value={form.date}
              onChange={(e) => changeDate(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning</CardTitle>
            <CardDescription>What did you study today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Learn Hours</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  value={form.learnHrs}
                  onChange={(e) => setForm({ ...form, learnHrs: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Course / Topic</Label>
                <Input
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  placeholder="e.g. Cursor AI, NODE red"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Finance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Expense (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.expense}
                  onChange={(e) => setForm({ ...form, expense: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wellbeing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Mood</Label>
                <span className="text-sm text-violet-400">{form.mood}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={form.mood}
                onChange={(e) => setForm({ ...form, mood: Number(e.target.value) })}
                className="w-full accent-violet-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Productivity</Label>
                <span className="text-sm text-violet-400">{form.productivity}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={form.productivity}
                onChange={(e) => setForm({ ...form, productivity: Number(e.target.value) })}
                className="w-full accent-violet-500"
              />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.exercise}
                  onChange={(e) => setForm({ ...form, exercise: e.target.checked })}
                  className="rounded accent-violet-500"
                />
                Exercise today
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.journalDone}
                  onChange={(e) => setForm({ ...form, journalDone: e.target.checked })}
                  className="rounded accent-violet-500"
                />
                Journaled
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reflection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Key Learning (1 line)</Label>
              <Input
                value={form.keyLearning}
                onChange={(e) => setForm({ ...form, keyLearning: e.target.value })}
                placeholder="Today's biggest takeaway"
              />
            </div>
            <div className="space-y-2">
              <Label>Journal Entry</Label>
              <Textarea
                value={form.journalText}
                onChange={(e) => setForm({ ...form, journalText: e.target.value })}
                placeholder="How was your day?"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Saving..." : isExisting ? "Update Entry" : isToday ? "Complete Check-in" : "Save Entry"}
        </Button>
      </form>
    </div>
  );
}
