import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isAuthorized(request: Request, secret?: string) {
  const headerSecret = request.headers.get("x-admin-secret");
  const expectedSecret = process.env.ADMIN_UPLOAD_SECRET;

  if (!expectedSecret) {
    throw new Error("ADMIN_UPLOAD_SECRET must be configured.");
  }

  return headerSecret === expectedSecret || secret === expectedSecret;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isAuthorized(request, body.secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const title = String(body.title || "").trim();
    const category = String(body.category || "travel").trim();
    const isFeatured = Boolean(body.is_featured);
    const projectTitle = String(body.project_title || "").trim() || title;
    const projectSlug = String(body.project_slug || "").trim() || toSlug(projectTitle || title);
    const videoUrl = String(body.video_url || "").trim();
    const thumbnailUrl = String(body.thumbnail_url || "").trim();
    const videoStoragePath = String(body.video_storage_path || "").trim();
    const thumbnailStoragePath = String(body.thumbnail_storage_path || "").trim();

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    if (!projectTitle || !projectSlug) {
      return NextResponse.json({ error: "project_title and project_slug are required." }, { status: 400 });
    }

    if (!["travel", "products", "events"].includes(category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "portfolio-media";
    const resolvedVideoUrl = videoUrl || (videoStoragePath ? supabase.storage.from(bucket).getPublicUrl(videoStoragePath).data.publicUrl : "");
    const resolvedThumbnailUrl =
      thumbnailUrl || (thumbnailStoragePath ? supabase.storage.from(bucket).getPublicUrl(thumbnailStoragePath).data.publicUrl : "");

    if (!resolvedVideoUrl) {
      return NextResponse.json({ error: "Missing video_url or video_storage_path." }, { status: 400 });
    }

    const id =
      String(body.id || "") ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const { error } = await supabase.from("portfolio_videos").upsert(
      {
        id,
        title,
        project_title: projectTitle,
        project_slug: projectSlug,
        video_url: resolvedVideoUrl,
        thumbnail: resolvedThumbnailUrl || null,
        category,
        is_featured: isFeatured,
        created_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      throw new Error(`DB insert failed: ${error.message}`);
    }

    return NextResponse.json({
      ok: true,
      id,
      title,
      project_title: projectTitle,
      project_slug: projectSlug,
      category,
      video_url: resolvedVideoUrl,
      thumbnail: resolvedThumbnailUrl || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload portfolio item." },
      { status: 500 },
    );
  }
}
