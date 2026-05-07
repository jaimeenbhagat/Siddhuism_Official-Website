import type { Metadata } from "next";
import { generatePageMetadata, PAGE_KEYWORDS, SITE_URL } from "@/lib/seo";
import { generateWebPageSchema, schemaToString } from "@/lib/schema";
import PortfolioPage from "@/components/portfolio-page";

export const revalidate = 900;

export const metadata: Metadata = generatePageMetadata({
  title: "Home",
  description: "Welcome to siddhuism_official's creator portfolio. Featuring commercial work, travel content, and professional video production across travel, e-commerce, and events.",
  ogTitle: "siddhuism_official | Creator Portfolio",
  ogDescription: "Explore cinematic travel, lifestyle, and commercial content. Professional portfolio with 500K+ followers across platforms.",
  ogImage: `${SITE_URL}/og-image.jpg`,
  ogType: "website",
  url: SITE_URL,
  keywords: PAGE_KEYWORDS.home,
  canonical: SITE_URL,
});

export default function Home() {
  return <PortfolioPage />;
}
