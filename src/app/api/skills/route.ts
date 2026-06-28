import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { Skill } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getStorage().getSkills());
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<Skill>;
  const skill: Skill = {
    id: body.id ?? generateId(),
    skill: body.skill ?? "",
    targetLevel: body.targetLevel ?? "",
    currentPct: body.currentPct ?? 0,
    targetQ: body.targetQ ?? "",
    selfRating: body.selfRating ?? 0,
  };

  await getStorage().upsertSkill(skill);
  return NextResponse.json(skill);
}
