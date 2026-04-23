import { NextResponse } from "next/server";
import { syncSocialData } from "@/services/social-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronHeader = request.headers.get("x-vercel-cron");
  const secret = new URL(request.url).searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (cronHeader !== "1" && (!expectedSecret || secret !== expectedSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncSocialData();
  return NextResponse.json(result);
}
