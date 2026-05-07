import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { PORTFOLIO_DATA, getBrandSlug } from "@/lib/portfolio-structure";

/**
 * Generate portfolio sitemap with all projects
 * URL: /api/sitemap-portfolio
 */
export async function GET() {
  const portfolioUrls: Array<{
    url: string;
    changefreq: string;
    priority: number;
    lastmod: string;
  }> = [];

  // Add portfolio projects
  PORTFOLIO_DATA.forEach((section) => {
    section.categories.forEach((category) => {
      category.brands.forEach((brand) => {
        const projectSlug = getBrandSlug(brand.name);
        if (brand.videos.length > 0) {
          portfolioUrls.push({
            url: `/portfolio/${projectSlug}`,
            changefreq: "monthly",
            priority: 0.8,
            lastmod: new Date().toISOString().split("T")[0],
          });
        }
      });
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${portfolioUrls
  .map(
    (item) => `
  <url>
    <loc>${SITE_URL}${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>
`
  )
  .join("")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
