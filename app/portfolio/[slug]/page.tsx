import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import ScrollProgress from "@/components/ui/scroll-progress";
import PageFadeIn from "@/components/ui/page-fade-in";
import PortfolioBadge from "@/components/ui/portfolio-badge";
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

  if (!videos.length && !staticProject) {
    notFound();
  }

  const projectTitle = videos.length ? videos[0].project_title : staticProject?.displayName || "Project";
  const projectCategory = videos.length ? videos[0].categoryLabel : staticProject?.categoryTitle || "Category";

  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main className="relative overflow-hidden px-4 pt-24 pb-20 sm:px-6 md:px-8 md:pt-28 md:pb-24 lg:px-10">
        <PageFadeIn>
          <div className="mx-auto w-full max-w-350 2xl:max-w-400">
          <nav className="mb-5 text-sm text-white">
            <Link href="/portfolio" className="hover:text-white">
              Portfolio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{projectTitle}</span>
          </nav>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <PortfolioBadge>{projectCategory}</PortfolioBadge>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl md:text-4xl lg:text-5xl">{projectTitle}</h1>
              <p className="mt-3 text-sm text-white md:text-base">
              </p>
            </div>

            <Link
              href="/portfolio"
              className="inline-flex rounded-full border border-slate-700/70 bg-slate-900/75 px-5 py-2 text-sm font-semibold text-white hover:border-blue-300/50"
            >
              Back to Portfolio
            </Link>
          </div>

          {staticProject?.videoGroups && staticProject.videoGroups.length > 0 ? (
            <div className="space-y-12">
              {staticProject.videoGroups.map((group) => {
                const groupVideos = group.videos.map((video, index) => ({
                  id: `${staticProject.slug}-${video.id}-${index}`,
                  title: `${group.title} Video ${index + 1}`,
                  project_slug: staticProject.slug,
                  project_title: staticProject.displayName,
                  video_url: video.url,
                  thumbnail: `https://img.youtube.com/vi/${video.id}/${video.type === "short" ? "hqdefault" : "maxresdefault"}.jpg`,
                  categoryLabel: staticProject.categoryTitle,
                  is_featured: false,
                  created_at: new Date().toISOString(),
                }));

                return (
                  <div key={group.title}>
                    <div className="mb-6 border-b border-slate-800 pb-2">
                      <PortfolioBadge>{group.title}</PortfolioBadge>
                    </div>
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                      {groupVideos.map((item) => (
                        <VideoCard key={item.id} item={{ ...item, category: item.categoryLabel }} />
                      ))}
                    </section>
                  </div>
                );
              })}
            </div>
          ) : videos.length > 0 ? (
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {videos.map((item) => (
                <VideoCard key={item.id} item={{ ...item, category: item.categoryLabel }} />
              ))}
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 py-20 text-center">
              <div className="mb-4 rounded-full bg-blue-500/10 p-4">
                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Coming Soon</h3>
              <p className="mt-2 text-white">The content for this project is currently being prepared.</p>
            </div>
          )}
          </div>
        </PageFadeIn>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
