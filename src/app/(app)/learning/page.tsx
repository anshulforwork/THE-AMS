"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, ProgressBar } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Course } from "@/lib/types";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const STATUSES = ["Not Started", "In Progress", "Completed", "Paused"];

const STATUS_STYLE: Record<string, string> = {
  "Not Started": "border-zinc-500/30 text-zinc-400",
  "In Progress": "border-blue-500/30 text-blue-400",
  Completed: "border-emerald-500/30 text-emerald-400",
  Paused: "border-amber-500/30 text-amber-400",
};

const BLANK: Omit<Course, "id"> = {
  quarter: "Q1", track: "", title: "", url: "", start: "", end: "",
  courseHrs: 0, progressPct: 0, status: "Not Started", skill: "", roi: "",
};

export default function LearningPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Course, "id"> & { id?: string }>(BLANK);

  async function load() {
    setCourses(await fetch("/api/courses").then((r) => r.json()));
  }
  useEffect(() => { load(); }, []);

  function openNew() {
    setForm(BLANK);
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(course: Course) {
    setForm(course);
    setEditing(course);
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    await fetch("/api/courses", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm(BLANK);
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/courses?id=${id}`, { method: "DELETE" });
  }

  const totalHrs = courses.reduce((s, c) => s + c.courseHrs, 0);
  const completedHrs = courses.reduce((s, c) => s + (c.courseHrs * c.progressPct) / 100, 0);
  const overallPct = totalHrs > 0 ? (completedHrs / totalHrs) * 100 : 0;
  const completed = courses.filter((c) => c.status === "Completed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Study Planner</h1>
          <p className="text-zinc-400">{completed}/{courses.length} courses done · plan, link, and track every course</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Add Course</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-400">Total Target Hours</p><p className="text-2xl font-bold">{totalHrs}h</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-400">Hours Completed</p><p className="text-2xl font-bold text-violet-400">{completedHrs.toFixed(0)}h</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-zinc-400">Overall Progress</p><p className="text-2xl font-bold text-emerald-400">{overallPct.toFixed(0)}%</p><ProgressBar value={overallPct} className="mt-2" /></CardContent></Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>{editing ? "Edit Course" : "Add Course"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Course Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Course URL (Udemy / any link)</Label>
                <Input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Quarter</Label>
                <Select value={form.quarter} onChange={(e) => setForm({ ...form, quarter: e.target.value })}>
                  {QUARTERS.map((q) => <option key={q} value={q}>{q}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Track</Label>
                <Input value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })} placeholder="PLC, STM32..." />
              </div>
              <div className="space-y-2">
                <Label>Course Hours</Label>
                <Input type="number" min="0" value={form.courseHrs} onChange={(e) => setForm({ ...form, courseHrs: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Progress %</Label>
                <Input type="number" min="0" max="100" value={form.progressPct} onChange={(e) => setForm({ ...form, progressPct: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start (YYYY-MM)</Label>
                <Input value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} placeholder="2026-06" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Skill Gained</Label>
                <Input value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>ROI Signal</Label>
                <Input value={form.roi} onChange={(e) => setForm({ ...form, roi: e.target.value })} placeholder="e.g. SCADA Engineers: ₹10-18L/yr" />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit">{editing ? "Save Changes" : "Add Course"}</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {QUARTERS.map((q) => {
        const qCourses = courses.filter((c) => c.quarter === q);
        if (qCourses.length === 0) return null;
        return (
          <div key={q} className="space-y-3">
            <h2 className="text-lg font-semibold text-violet-300">{q}</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {qCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {course.track && <Badge>{course.track}</Badge>}
                          <Badge className={STATUS_STYLE[course.status]}>{course.status}</Badge>
                        </div>
                        <CardTitle className="text-base">{course.title}</CardTitle>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        {course.url && (
                          <a href={course.url} target="_blank" rel="noopener noreferrer" title="Open course">
                            <ExternalLink className="h-4 w-4 text-zinc-500 hover:text-violet-400" />
                          </a>
                        )}
                        <button onClick={() => openEdit(course)} title="Edit">
                          <Pencil className="h-4 w-4 text-zinc-500 hover:text-violet-400" />
                        </button>
                        <button onClick={() => remove(course.id)} title="Delete">
                          <Trash2 className="h-4 w-4 text-zinc-500 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.skill && <p className="text-sm text-zinc-400">{course.skill}</p>}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">{course.courseHrs}h{course.start ? ` · ${course.start}` : ""}</span>
                      <span className="font-medium text-violet-400">{course.progressPct}%</span>
                    </div>
                    <ProgressBar value={course.progressPct} />
                    {course.roi && <p className="text-xs text-emerald-400/80">{course.roi}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {courses.length === 0 && !showForm && (
        <Card><CardContent className="py-12 text-center text-zinc-500">No courses yet. Add your first study course with a link.</CardContent></Card>
      )}
    </div>
  );
}
