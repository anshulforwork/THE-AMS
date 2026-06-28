import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { BudgetCategory } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getStorage().getBudgets());
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<BudgetCategory>;
  const budget: BudgetCategory = {
    id: body.id ?? generateId(),
    category: body.category ?? "",
    budget: body.budget ?? 0,
  };
  await getStorage().upsertBudget(budget);
  return NextResponse.json(budget);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const budget = (await request.json()) as BudgetCategory;
  await getStorage().upsertBudget(budget);
  return NextResponse.json(budget);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await getStorage().deleteBudget(id);
  return NextResponse.json({ success: true });
}
