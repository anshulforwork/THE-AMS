import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { Goal } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getStorage().getGoals());
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<Goal>;
  const goal: Goal = {
    id: body.id ?? generateId(),
    title: body.title ?? "",
    category: body.category ?? "Personal",
    target: body.target ?? 0,
    current: body.current ?? 0,
    unit: body.unit ?? "",
    deadline: body.deadline ?? "",
    status: body.status ?? "active",
    notes: body.notes ?? "",
  };
  await getStorage().upsertGoal(goal);
  return NextResponse.json(goal);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goal = (await request.json()) as Goal;
  await getStorage().upsertGoal(goal);
  return NextResponse.json(goal);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await getStorage().deleteGoal(id);
  return NextResponse.json({ success: true });
}
