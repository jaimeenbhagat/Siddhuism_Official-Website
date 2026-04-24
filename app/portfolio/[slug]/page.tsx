import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import ScrollProgress from "@/components/ui/scroll-progress";
import PageFadeIn from "@/components/ui/page-fade-in";
import VideoCard from "@/components/video-card";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { PortfolioVideo } from "@/lib/portfolio-db";
import { getPortfolioProjectBySlug } from "@/lib/portfolio-structure";

export const runtime = "nodejs";
export const revalidate = 300;
const DEFAULT_THUMBNAIL = "/profile-orb.svg";

type ProjectPageVideo = Pick<PortfolioVideo, "id" | "title" | "project_slug" | "project_title" | "video_url" | "thumbnail" | "is_featured" | "created_at"> & {
  categoryLabel: string;
};

const HOSTELLER_FALLBACK: ProjectPageVideo[] = [
  {
    id: "hosteller-video-1",
    title: "Hosteller Video 1",
    project_slug: "the-hosteller",
    project_title: "The Hosteller",
    video_url: "https://www.youtube.com/watch?v=GlucobCFSes",
    thumbnail: "https://img.youtube.com/vi/GlucobCFSes/hqdefault.jpg",
    categoryLabel: "Travel & Hospitality",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "hosteller-video-2",
    title: "Hosteller Video 2",
    project_slug: "the-hosteller",
    project_title: "The Hosteller",
    video_url: "https://www.youtube.com/watch?v=iCgcMb1AcqA",
    thumbnail: "https://img.youtube.com/vi/iCgcMb1AcqA/hqdefault.jpg",
    categoryLabel: "Travel & Hospitality",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "hosteller-video-3",
    title: "Hosteller Video 3",
    project_slug: "the-hosteller",
    project_title: "The Hosteller",
    video_url: "https://www.youtube.com/watch?v=j1M9hCaklxc",
    thumbnail: "https://img.youtube.com/vi/j1M9hCaklxc/hqdefault.jpg",
    categoryLabel: "Travel & Hospitality",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

function categoryLabel(category: string) {
  if (category === "travel") {
    return "Travel & Hospitality";
  }

  if (category === "products") {
    return "E-Commerce";
  }

  if (category === "events") {
    return "Events";
  }

  return category;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PortfolioProjectPage({ params }: Props) {
  const { slug } = await params;
  const supabase = getSupabaseAdminClient();
  const staticProject = getPortfolioProjectBySlug(slug);

  const { data, error } = await supabase
    .from("portfolio_videos")
    .select("id,title,project_slug,project_title,video_url,thumbnail,category,is_featured,created_at")
    .eq("project_slug", slug)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(60);

  const dbVideos: ProjectPageVideo[] = (error ? [] : ((data || []) as PortfolioVideo[])).map((row) => ({
    ...row,
    thumbnail: row.thumbnail || DEFAULT_THUMBNAIL,
    categoryLabel: categoryLabel(row.category),
  }));

  const staticVideos: ProjectPageVideo[] = staticProject
    ? staticProject.videos.map((video, index) => ({
        id: `${staticProject.slug}-${video.id}-${index}`,
        title: `${staticProject.displayName} Video ${index + 1}`,
        project_slug: staticProject.slug,
        project_title: staticProject.displayName,
        video_url: video.url,
        thumbnail: `https://img.youtube.com/vi/${video.id}/${video.type === "short" ? "hqdefault" : "maxresdefault"}.jpg`,
        categoryLabel: staticProject.categoryTitle,
        is_featured: index === 0,
        created_at: new Date().toISOString(),
      }))
    : [];

  const videos = dbVideos.length
    ? dbVideos
    : staticVideos.length
      ? staticVideos
      : slug === "the-hosteller"
        ? HOSTELLER_FALLBACK
        : [];

  if (!videos.length) {
    notFound();
  }

  const projectTitle = videos[0].project_title;
  const projectCategory = videos[0].categoryLabel;
  const projectDescription = staticProject?.description;

  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-28 md:pb-26">
        <PageFadeIn>
          <div className="mx-auto max-w-7xl">
          <nav className="mb-5 text-sm text-slate-400">
            <Link href="/portfolio" className="hover:text-blue-300">
              Portfolio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-200">{projectTitle}</span>
          </nav>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-blue-300">{projectCategory}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100 md:text-5xl">{projectTitle}</h1>
              <p className="mt-3 text-sm text-slate-400 md:text-base">
                {projectDescription || "Full project work with all published videos for this brand."}
              </p>
            </div>

            <Link
              href="/portfolio"
              className="inline-flex rounded-full border border-slate-700/70 bg-slate-900/75 px-5 py-2 text-sm font-semibold text-slate-100 hover:border-blue-300/50"
            >
              Back to Portfolio
            </Link>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((item) => (
              <VideoCard key={item.id} item={{ ...item, category: item.categoryLabel }} />
            ))}
          </section>
          </div>
        </PageFadeIn>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
