import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { Course } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getStorage().getCourses());
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<Course>;
  const course: Course = {
    id: body.id ?? generateId(),
    quarter: body.quarter ?? "Q1",
    track: body.track ?? "",
    title: body.title ?? "",
    url: body.url ?? "",
    start: body.start ?? "",
    end: body.end ?? "",
    courseHrs: body.courseHrs ?? 0,
    progressPct: body.progressPct ?? 0,
    status: body.status ?? "Not Started",
    skill: body.skill ?? "",
    roi: body.roi ?? "",
  };

  await getStorage().upsertCourse(course);
  return NextResponse.json(course);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const course = (await request.json()) as Course;
  await getStorage().upsertCourse(course);
  return NextResponse.json(course);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await getStorage().deleteCourse(id);
  return NextResponse.json({ success: true });
}
