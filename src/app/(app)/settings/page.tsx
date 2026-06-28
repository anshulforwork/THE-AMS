"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Database, Download, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppSetup } from "@/lib/types";

export default function SettingsPage() {
  const [setup, setSetup] = useState<AppSetup | null>(null);
  const [storageMode, setStorageMode] = useState<string>("local");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/setup").then((r) => r.json()),
      fetch("/api/storage/init").then((r) => r.json()),
    ]).then(([s, m]) => { setSetup(s); setStorageMode(m.mode); });
  }, []);

  async function saveSetup(e: React.FormEvent) {
    e.preventDefault();
    if (!setup) return;
    setLoading("save");
    await fetch("/api/setup", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(setup),
    });
    setMessage("Settings saved!");
    setLoading("");
    setTimeout(() => setMessage(""), 3000);
  }

  async function initStorage() {
    setLoading("init");
    const res = await fetch("/api/storage/init", { method: "POST" });
    const data = await res.json();
    setMessage(data.message ?? data.error);
    setStorageMode(data.mode ?? storageMode);
    setLoading("");
  }

  async function importExcel() {
    setLoading("import");
    const res = await fetch("/api/import", { method: "POST" });
    const data = await res.json();
    setMessage(data.error ?? `Imported ${data.imported} daily log entries`);
    setLoading("");
  }

  if (!setup) {
    return <div className="flex h-64 items-center justify-center text-zinc-400">Loading settings...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <img
          src="/profile.png"
          alt="Profile"
          className="h-16 w-16 rounded-full object-cover ring-2 ring-violet-500/40"
        />
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">{setup.name || "Settings"}</h1>
          <p className="text-zinc-400">Configure your app and data connection</p>
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-950/30 p-4 text-sm text-violet-300">
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile & Budget Setup</CardTitle>
          <CardDescription>One-time setup values (synced to your sheet)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveSetup} className="space-y-4">
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input value={setup.name} onChange={(e) => setSetup({ ...setup, name: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Monthly Income (₹)</Label>
                <Input type="number" value={setup.monthlyIncome} onChange={(e) => setSetup({ ...setup, monthlyIncome: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Monthly Budget (₹)</Label>
                <Input type="number" value={setup.monthlyBudget} onChange={(e) => setSetup({ ...setup, monthlyBudget: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Udemy Plan Cost (₹)</Label>
                <Input type="number" value={setup.udemyCost} onChange={(e) => setSetup({ ...setup, udemyCost: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Annual Savings Goal (₹)</Label>
                <Input type="number" value={setup.savingsGoal} onChange={(e) => setSetup({ ...setup, savingsGoal: Number(e.target.value) })} />
              </div>
            </div>
            <Button type="submit" disabled={loading === "save"}>
              {loading === "save" ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Connection
          </CardTitle>
          <CardDescription>
            Mode: <span className="font-medium text-violet-400">{storageMode === "cloud" ? "Cloud (Supabase) — synced across devices" : "Local (this device only)"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-400">
            {storageMode === "cloud"
              ? "Connected to your free Supabase database. Data syncs on every device automatically."
              : "Using local storage on this machine. Add Supabase keys to sync across phone + laptop. See SETUP.md."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={initStorage} disabled={loading === "init"}>
              <RefreshCw className="h-4 w-4" />
              {loading === "init" ? "Initializing..." : "Seed / Initialize Data"}
            </Button>
            <Button variant="outline" onClick={importExcel} disabled={loading === "import"}>
              <Download className="h-4 w-4" />
              {loading === "import" ? "Importing..." : "Import from Excel"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
