import type { Metadata } from "next";
import { generatePageMetadata, PAGE_KEYWORDS, SITE_URL } from "@/lib/seo";
import PortfolioFullPage from "@/components/portfolio-full-page";

export const revalidate = 600;

export const metadata: Metadata = generatePageMetadata({
  title: "Portfolio",
  description: "Explore a curated selection of commercial projects and creative work. Premium content for travel, e-commerce, and events brands. Professional video production and cinematography portfolio.",
  ogTitle: "Portfolio - siddhuism_official",
  ogDescription: "Premium commercial portfolio featuring travel, e-commerce, and events projects. Professional content creation and cinematography.",
  ogImage: `${SITE_URL}/og-image.jpg`,
  url: `${SITE_URL}/portfolio`,
  canonical: `${SITE_URL}/portfolio`,
  keywords: PAGE_KEYWORDS.portfolio,
});

export default function PortfolioRoutePage() {
  return <PortfolioFullPage />;
}
