import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import type { DailyLog } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await getStorage().getDailyLogs();
  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<DailyLog>;
  const date = body.date ?? new Date().toISOString().slice(0, 10);
  const day = body.day ?? new Date(date).toLocaleDateString("en-US", { weekday: "long" });

  const log: DailyLog = {
    date,
    day,
    learnHrs: body.learnHrs ?? 0,
    course: body.course ?? "",
    expense: body.expense ?? 0,
    category: body.category ?? "",
    mood: body.mood ?? 0,
    productivity: body.productivity ?? 0,
    exercise: body.exercise ?? false,
    journalDone: body.journalDone ?? false,
    keyLearning: body.keyLearning ?? "",
    journalText: body.journalText ?? "",
    checkinTimestamp: new Date().toISOString(),
  };

  await getStorage().upsertDailyLog(log);
  return NextResponse.json(log);
}
