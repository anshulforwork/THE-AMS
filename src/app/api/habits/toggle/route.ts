import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { habitId, date } = await request.json();
  if (!habitId) return NextResponse.json({ error: "Missing habitId" }, { status: 400 });

  const day = date ?? new Date().toISOString().slice(0, 10);
  const done = await getStorage().toggleHabitLog(habitId, day);
  return NextResponse.json({ done });
}
