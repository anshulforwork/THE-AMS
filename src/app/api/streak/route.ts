import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { calculateStreak } from "@/lib/streak";
import { getStorage } from "@/lib/storage";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await getStorage().getDailyLogs();
  return NextResponse.json(calculateStreak(logs));
}
