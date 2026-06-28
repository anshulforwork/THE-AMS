import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { computeDashboard } from "@/lib/analytics";
import { getStorage } from "@/lib/storage";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const storage = getStorage();
  const [logs, setup] = await Promise.all([
    storage.getDailyLogs(),
    storage.getSetup(),
  ]);

  const stats = computeDashboard(logs, setup);
  return NextResponse.json({ ...stats, setup, name: setup.name });
}
