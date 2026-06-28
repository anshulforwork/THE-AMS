import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { Milestone } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getStorage().getMilestones());
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<Milestone>;
  const milestone: Milestone = {
    id: body.id ?? generateId(),
    month: body.month ?? "",
    deliverable: body.deliverable ?? "",
    type: body.type ?? "",
    status: body.status ?? "pending",
    idxLink: body.idxLink ?? "NO",
    notes: body.notes ?? "",
  };

  await getStorage().upsertMilestone(milestone);
  return NextResponse.json(milestone);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const milestone = (await request.json()) as Milestone;
  await getStorage().upsertMilestone(milestone);
  return NextResponse.json(milestone);
}
