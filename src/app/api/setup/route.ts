import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import type { AppSetup } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const setup = await getStorage().getSetup();
  return NextResponse.json(setup);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<AppSetup>;
  await getStorage().updateSetup(body);
  const setup = await getStorage().getSetup();
  return NextResponse.json(setup);
}
