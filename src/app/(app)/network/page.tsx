"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { NetworkContact } from "@/lib/types";

const IMPORTANCE_COLORS: Record<string, string> = {
  high: "border-red-500/30 text-red-400",
  medium: "border-yellow-500/30 text-yellow-400",
  low: "border-zinc-500/30 text-zinc-400",
};

export default function NetworkPage() {
  const [contacts, setContacts] = useState<NetworkContact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", relationship: "", company: "", role: "",
    contact: "", lastContacted: "", nextFollowup: "",
    importance: "medium", notes: "",
  });

  useEffect(() => {
    fetch("/api/network").then((r) => r.json()).then(setContacts);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const needsFollowup = contacts.filter(
    (c) => c.nextFollowup && c.nextFollowup <= today
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const contact = await res.json();
    setContacts((prev) => [...prev, contact]);
    setShowForm(false);
    setForm({
      name: "", relationship: "", company: "", role: "",
      contact: "", lastContacted: "", nextFollowup: "",
      importance: "medium", notes: "",
    });
  }

  async function handleDelete(id: string) {
    await fetch(`/api/network?id=${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Network</h1>
          <p className="text-zinc-400">Your personal CRM — nurture relationships that matter</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      {needsFollowup.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-950/20">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-300">{needsFollowup.length} follow-up(s) due</p>
              <p className="text-sm text-zinc-400">
                {needsFollowup.map((c) => c.name).join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Input value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} placeholder="Mentor, Colleague, Friend" />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Contact (email/phone)</Label>
                <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Importance</Label>
                <Select value={form.importance} onChange={(e) => setForm({ ...form, importance: e.target.value })}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Last Contacted</Label>
                <Input type="date" value={form.lastContacted} onChange={(e) => setForm({ ...form, lastContacted: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Next Follow-up</Label>
                <Input type="date" value={form.nextFollowup} onChange={(e) => setForm({ ...form, nextFollowup: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <Button type="submit" className="sm:col-span-2">Save Contact</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {contacts.map((c) => (
          <Card key={c.id} className={c.nextFollowup && c.nextFollowup <= today ? "border-amber-500/30" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-white">{c.name}</p>
                    <Badge className={IMPORTANCE_COLORS[c.importance]}>{c.importance}</Badge>
                  </div>
                  <p className="text-sm text-zinc-400">{c.role}{c.company ? ` @ ${c.company}` : ""}</p>
                  {c.relationship && <p className="text-xs text-zinc-500">{c.relationship}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="h-4 w-4 text-zinc-500" />
                </Button>
              </div>
              {c.contact && <p className="mt-2 text-sm text-violet-400">{c.contact}</p>}
              <div className="mt-3 flex gap-4 text-xs text-zinc-500">
                {c.lastContacted && <span>Last: {formatDate(c.lastContacted)}</span>}
                {c.nextFollowup && (
                  <span className={c.nextFollowup <= today ? "text-amber-400" : ""}>
                    Follow-up: {formatDate(c.nextFollowup)}
                  </span>
                )}
              </div>
              {c.notes && <p className="mt-2 text-sm text-zinc-400">{c.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            No contacts yet. Add mentors, colleagues, and friends to build your network.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
