import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { NetworkContact } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getStorage().getNetwork());
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<NetworkContact>;
  const contact: NetworkContact = {
    id: body.id ?? generateId(),
    name: body.name ?? "",
    relationship: body.relationship ?? "",
    company: body.company ?? "",
    role: body.role ?? "",
    contact: body.contact ?? "",
    lastContacted: body.lastContacted ?? "",
    nextFollowup: body.nextFollowup ?? "",
    importance: body.importance ?? "medium",
    notes: body.notes ?? "",
  };

  await getStorage().upsertNetworkContact(contact);
  return NextResponse.json(contact);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contact = (await request.json()) as NetworkContact;
  await getStorage().upsertNetworkContact(contact);
  return NextResponse.json(contact);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await getStorage().deleteNetworkContact(id);
  return NextResponse.json({ success: true });
}
