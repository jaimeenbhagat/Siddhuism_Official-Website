import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";

/**
 * Generate sitemap XML for main website pages
 * URL: /api/sitemap
 */
export async function GET() {
  const pages = [
    {
      url: "",
      changefreq: "daily",
      priority: 1.0,
      lastmod: new Date().toISOString().split("T")[0],
    },
    {
      url: "/portfolio",
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString().split("T")[0],
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${pages
  .map(
    (page) => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
