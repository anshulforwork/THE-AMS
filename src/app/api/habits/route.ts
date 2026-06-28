import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import { computeHabitStats } from "@/lib/habits";
import { generateId } from "@/lib/utils";
import type { Habit } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const storage = getStorage();
  const [habits, logs] = await Promise.all([storage.getHabits(), storage.getHabitLogs()]);
  return NextResponse.json(computeHabitStats(habits, logs));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<Habit>;
  const habit: Habit = {
    id: body.id ?? generateId(),
    name: body.name ?? "New Habit",
    icon: body.icon ?? "Circle",
    color: body.color ?? "violet",
    cadence: body.cadence ?? "daily",
    createdAt: body.createdAt ?? new Date().toISOString(),
    archived: body.archived ?? false,
  };
  await getStorage().upsertHabit(habit);
  return NextResponse.json(habit);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await getStorage().deleteHabit(id);
  return NextResponse.json({ success: true });
}
