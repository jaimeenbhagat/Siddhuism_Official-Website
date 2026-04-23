"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/ui/scroll-progress";
import BackToTop from "@/components/ui/back-to-top";

type UploadInitResponse = {
  ok?: boolean;
  bucket?: string;
  videoPath?: string;
  thumbnailPath?: string;
  videoSignedUrl?: string;
  thumbnailSignedUrl?: string;
  error?: string;
};

async function uploadToSignedUrl(signedUrl: string, file: File, label: "Video" | "Thumbnail") {
  const contentType = file.type || "application/octet-stream";

  const putAttempt = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (putAttempt.ok) {
    return;
  }

  const postAttempt = await fetch(signedUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (postAttempt.ok) {
    return;
  }

  throw new Error(
    `${label} upload failed (${putAttempt.status}/${postAttempt.status}). Check bucket access and signed upload URL validity.`,
  );
}

export default function AdminUploadPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const projectTitle = String(formData.get("project_title") || "").trim() || title;
    const projectSlug =
      String(formData.get("project_slug") || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      projectTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    const category = String(formData.get("category") || "travel");
    const isFeatured = String(formData.get("is_featured") || "false") === "true";
    const videoUrlInput = String(formData.get("video_url") || "").trim();
    const thumbnailUrlInput = String(formData.get("thumbnail_url") || "").trim();
    const videoFile = formData.get("video_file");
    const thumbnailFile = formData.get("thumbnail_file");

    try {
      let videoUrl = videoUrlInput;
      let thumbnailUrl = thumbnailUrlInput;
      let videoStoragePath = "";
      let thumbnailStoragePath = "";

      if (videoFile instanceof File && videoFile.size > 0) {
        const initResponse = await fetch("/api/admin/portfolio-upload/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret,
            title,
            projectTitle,
            projectSlug,
            category,
            videoFileName: videoFile.name,
            thumbnailFileName: thumbnailFile instanceof File ? thumbnailFile.name : undefined,
          }),
        });

        const initPayload = (await initResponse.json()) as UploadInitResponse;

        if (!initResponse.ok) {
          throw new Error(initPayload.error || "Unable to initialize upload.");
        }

        videoStoragePath = initPayload.videoPath || "";
        thumbnailStoragePath = initPayload.thumbnailPath || "";

        if (initPayload.videoSignedUrl) {
          await uploadToSignedUrl(initPayload.videoSignedUrl, videoFile, "Video");
        }

        if (thumbnailFile instanceof File && thumbnailFile.size > 0 && initPayload.thumbnailSignedUrl) {
          await uploadToSignedUrl(initPayload.thumbnailSignedUrl, thumbnailFile, "Thumbnail");
        }

        videoUrl = "";
        thumbnailUrl = "";
      }

      const response = await fetch("/api/admin/portfolio-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({
          secret,
          title,
          project_title: projectTitle,
          project_slug: projectSlug,
          category,
          is_featured: isFeatured,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          video_storage_path: videoStoragePath,
          thumbnail_storage_path: thumbnailStoragePath,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Upload failed.");
      }

      event.currentTarget.reset();
      setMessage(`Saved ${payload.title}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen px-6 pt-28 pb-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-slate-700/70 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-10"
          >
            <p className="text-xs uppercase tracking-[0.26em] text-blue-300">Admin Upload</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-100 md:text-5xl">Portfolio Publisher</h1>
            <p className="mt-3 text-sm text-slate-400">
              Upload a video to Supabase Storage or save an external video URL directly to portfolio_videos.
            </p>

            {!authenticated ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
                <input
                  type="password"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  placeholder="Enter admin secret"
                  className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAuthenticated(Boolean(secret.trim()))}
                  className="rounded-2xl border border-blue-300/60 bg-gradient-to-r from-blue-500/35 to-violet-500/35 px-5 py-3 font-semibold text-white"
                >
                  Unlock
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <input name="title" required placeholder="Video title" className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-slate-100" />
                  <input name="project_title" required placeholder="Project title (e.g. The Hosteller)" className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <input name="project_slug" placeholder="Project slug (optional, e.g. the-hosteller)" className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-slate-100" />
                  <select name="category" defaultValue="travel" className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-slate-100">
                    <option value="travel">Travel</option>
                    <option value="products">E-Commerce</option>
                    <option value="events">Events</option>
                  </select>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <input name="video_url" placeholder="External video URL (optional if uploading file)" className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-slate-100" />
                  <input name="thumbnail_url" placeholder="Thumbnail URL (optional if uploading file)" className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                    <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Video File</span>
                    <input name="video_file" type="file" accept="video/*" className="mt-2 w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500/30 file:px-4 file:py-2 file:text-white" />
                  </label>
                  <label className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                    <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Thumbnail File</span>
                    <input name="thumbnail_file" type="file" accept="image/*" className="mt-2 w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-violet-500/30 file:px-4 file:py-2 file:text-white" />
                  </label>
                </div>

                <label className="inline-flex items-center gap-3 text-sm text-slate-300">
                  <input name="is_featured" type="checkbox" value="true" className="h-4 w-4 rounded border-slate-600 bg-slate-900" />
                  Mark as featured
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full border border-blue-300/60 bg-gradient-to-r from-blue-500/35 to-violet-500/35 px-6 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {loading ? "Uploading..." : "Upload to Supabase"}
                </button>
              </form>
            )}

            {message ? <p className="mt-5 text-sm text-emerald-300">{message}</p> : null}
            {error ? <p className="mt-5 text-sm text-rose-300">{error}</p> : null}

            <div className="mt-8">
              <Link href="/portfolio" className="text-sm text-blue-300 hover:text-blue-200">
                View portfolio page
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
