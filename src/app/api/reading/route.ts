import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { ReadingBook } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getStorage().getReading());
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<ReadingBook>;
  const book: ReadingBook = {
    id: body.id ?? generateId(),
    book: body.book ?? "",
    author: body.author ?? "",
    totalPg: body.totalPg ?? 0,
    targetPgWk: body.targetPgWk ?? 0,
    pagesRead: body.pagesRead ?? 0,
  };

  await getStorage().upsertReading(book);
  return NextResponse.json(book);
}
