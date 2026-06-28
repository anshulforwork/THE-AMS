"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Milestone } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "border-zinc-500/30 text-zinc-400",
  "in-progress": "border-blue-500/30 text-blue-400",
  done: "border-emerald-500/30 text-emerald-400",
};

export default function PlanningPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    month: "", deliverable: "", type: "Code", status: "pending", idxLink: "NO", notes: "",
  });

  useEffect(() => {
    fetch("/api/milestones").then((r) => r.json()).then(setMilestones);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const milestone = await res.json();
    setMilestones((prev) => [...prev, milestone]);
    setShowForm(false);
    setForm({ month: "", deliverable: "", type: "Code", status: "pending", idxLink: "NO", notes: "" });
  }

  async function updateStatus(milestone: Milestone, status: string) {
    const updated = { ...milestone, status };
    await fetch("/api/milestones", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setMilestones((prev) => prev.map((m) => (m.id === milestone.id ? updated : m)));
  }

  const done = milestones.filter((m) => m.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Planning & Goals</h1>
          <p className="text-zinc-400">{done}/{milestones.length} milestones completed</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Add Milestone
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Milestone</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Month</Label>
                <Input value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} placeholder="M1" required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {["Code", "SCADA", "CAPSTONE", "Embedded", "EMS", "Docs", "Design", "Cloud"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Deliverable</Label>
                <Input value={form.deliverable} onChange={(e) => setForm({ ...form, deliverable: e.target.value })} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <Button type="submit" className="sm:col-span-2">Add Milestone</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {milestones.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 text-sm font-bold text-violet-400">
                {m.month}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">{m.deliverable}</p>
                  <Badge>{m.type}</Badge>
                  {m.idxLink === "YES" && <Badge className="border-orange-500/30 text-orange-400">iDEX</Badge>}
                </div>
                {m.notes && <p className="mt-1 text-sm text-zinc-400">{m.notes}</p>}
              </div>
              <Select
                value={m.status}
                onChange={(e) => updateStatus(m, e.target.value)}
                className={`w-36 ${STATUS_COLORS[m.status] ?? ""}`}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
