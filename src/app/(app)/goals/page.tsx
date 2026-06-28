"use client";

import { useEffect, useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";
import { Badge, ProgressBar } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Goal } from "@/lib/types";

const CATEGORIES = ["Career", "Finance", "Learning", "Health", "Personal", "Network"];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", category: "Career", target: 0, current: 0, unit: "", deadline: "", notes: "",
  });

  async function load() {
    setGoals(await fetch("/api/goals").then((r) => r.json()));
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", category: "Career", target: 0, current: 0, unit: "", deadline: "", notes: "" });
    setShowForm(false);
    load();
  }

  async function updateCurrent(goal: Goal, current: number) {
    const status = goal.target > 0 && current >= goal.target ? "done" : "active";
    const updated = { ...goal, current, status };
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? updated : g)));
    await fetch("/api/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  }

  async function remove(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
  }

  const active = goals.filter((g) => g.status !== "done");
  const done = goals.filter((g) => g.status === "done");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Goals</h1>
          <p className="text-zinc-400">{done.length} achieved · {active.length} in progress</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Add Goal
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Goal</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={add} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Goal</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Reach ₹5L salary" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Target value</Label>
                <Input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Unit (₹, hrs, kg...)</Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <Button type="submit" className="sm:col-span-2">Create Goal</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {goals.map((goal) => {
          const pct = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
          return (
            <Card key={goal.id} className={goal.status === "done" ? "border-emerald-500/30" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-violet-400" />
                    <p className="font-semibold text-white">{goal.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{goal.category}</Badge>
                    <button onClick={() => remove(goal.id)} className="text-zinc-600 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {goal.notes && <p className="mt-1 text-sm text-zinc-400">{goal.notes}</p>}
                {goal.target > 0 && (
                  <>
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-zinc-500">{goal.current}{goal.unit} / {goal.target}{goal.unit}</span>
                      <span className="text-violet-400">{pct.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={pct} className="mt-1" />
                    <Input
                      type="number"
                      defaultValue={goal.current}
                      onBlur={(e) => updateCurrent(goal, Number(e.target.value))}
                      className="mt-3"
                      placeholder="Update progress"
                    />
                  </>
                )}
                {goal.deadline && (
                  <p className="mt-2 text-xs text-zinc-500">Deadline: {formatDate(goal.deadline)}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            No goals yet. Set targets for your journey — salary, savings, skills, fitness.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
