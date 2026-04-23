import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InitPayload = {
  secret?: string;
  title?: string;
  projectTitle?: string;
  projectSlug?: string;
  category?: "travel" | "products" | "events";
  videoFileName?: string;
  thumbnailFileName?: string;
};

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getExtension(name?: string, fallback = "bin") {
  if (!name || !name.includes(".")) {
    return fallback;
  }

  const extension = name.split(".").pop();
  return extension || fallback;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InitPayload;
    const expectedSecret = process.env.ADMIN_UPLOAD_SECRET;

    if (!expectedSecret) {
      throw new Error("ADMIN_UPLOAD_SECRET must be configured.");
    }

    if (body.secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const title = String(body.title || "").trim();
    const projectTitle = String(body.projectTitle || "").trim() || title;
    const category = body.category || "travel";

    if (!title || !projectTitle) {
      return NextResponse.json({ error: "Title and projectTitle are required." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "portfolio-media";
    const baseSlug = sanitizeSlug(String(body.projectSlug || "")) || sanitizeSlug(projectTitle) || randomUUID();
    const folder = `${sanitizeSlug(category)}/${baseSlug}`;

    const videoPath = `videos/${folder}.${getExtension(body.videoFileName, "mp4")}`;
    const thumbnailPath = body.thumbnailFileName
      ? `thumbnails/${folder}.${getExtension(body.thumbnailFileName, "jpg")}`
      : undefined;

    const { data: videoUpload } = await supabase.storage.from(bucket).createSignedUploadUrl(videoPath);
    const { data: thumbnailUpload } = thumbnailPath
      ? await supabase.storage.from(bucket).createSignedUploadUrl(thumbnailPath)
      : { data: undefined };

    return NextResponse.json({
      ok: true,
      bucket,
      videoPath,
      thumbnailPath,
      videoToken: videoUpload?.token,
      thumbnailToken: thumbnailUpload?.token,
      videoSignedUrl: videoUpload?.signedUrl,
      thumbnailSignedUrl: thumbnailUpload?.signedUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to initialize upload." },
      { status: 500 },
    );
  }
}
