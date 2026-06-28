import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage, getStorageMode } from "@/lib/storage";

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await getStorage().initialize();
    return NextResponse.json({
      success: true,
      mode: getStorageMode(),
      message:
        getStorageMode() === "cloud"
          ? "Cloud database seeded successfully."
          : "Local data initialized.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Initialization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    mode: getStorageMode(),
    cloudConfigured: getStorageMode() === "cloud",
  });
}
