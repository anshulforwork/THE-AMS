"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReadingBook, Skill } from "@/lib/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [reading, setReading] = useState<ReadingBook[]>([]);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/reading").then((r) => r.json()),
    ]).then(([s, r]) => { setSkills(s); setReading(r); });
  }, []);

  async function updateSkill(skill: Skill, currentPct: number) {
    const updated = { ...skill, currentPct };
    await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setSkills((prev) => prev.map((s) => (s.id === skill.id ? updated : s)));
    setEditingSkill(null);
  }

  async function updateReading(book: ReadingBook, pagesRead: number) {
    const updated = { ...book, pagesRead };
    await fetch("/api/reading", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setReading((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Skills & Reading</h1>
        <p className="text-zinc-400">Track your skill progression and reading goals</p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-violet-300">Skill Progression Map</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{skill.skill}</p>
                    <p className="text-xs text-zinc-500">Target: {skill.targetLevel} · {skill.targetQ}</p>
                  </div>
                  <span className="text-sm font-bold text-violet-400">{skill.currentPct}%</span>
                </div>
                <ProgressBar value={skill.currentPct} className="my-2" />
                {editingSkill === skill.id ? (
                  <div className="flex gap-2">
                    <Input type="number" min="0" max="100" value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-20" />
                    <Button size="sm" onClick={() => updateSkill(skill, pct)}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingSkill(null)}>Cancel</Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => { setEditingSkill(skill.id); setPct(skill.currentPct); }}>
                    Update
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-violet-300">Reading Tracker</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {reading.map((book) => {
            const pctRead = book.totalPg > 0 ? (book.pagesRead / book.totalPg) * 100 : 0;
            return (
              <Card key={book.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{book.book}</CardTitle>
                  <p className="text-sm text-zinc-400">{book.author}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">{book.pagesRead}/{book.totalPg} pages</span>
                    <span className="text-violet-400">{pctRead.toFixed(0)}%</span>
                  </div>
                  <ProgressBar value={pctRead} />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      max={book.totalPg}
                      placeholder="Pages read"
                      defaultValue={book.pagesRead}
                      onBlur={(e) => updateReading(book, Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
