/**
 * SEO Utility Functions for Siddhuism Official
 * Handles metadata generation, canonical URLs, and SEO helpers
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://siddhuism-official.vercel.app";
export const SITE_NAME = "siddhuism_official";
export const CREATOR_NAME = "Siddhuism Official";
export const CREATOR_HANDLE = "@siddhuism_official";
export const CREATOR_BIO = "Creator, filmmaker, and content specialist. Crafting cinematic travel, lifestyle, and commercial content.";

// Default OG image
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Social media links
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/siddhuism_official",
  youtube: "https://youtube.com/@siddhuism_official",
  twitter: "https://twitter.com/siddhuism_official",
  linkedin: "https://linkedin.com/in/siddhuism",
};

/**
 * Generate metadata for a page
 */
export function generatePageMetadata(options: {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile" | "video.other";
  url?: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonical?: string;
}) {
  const baseTitle = `${options.title || SITE_NAME} | Creator Portfolio`;
  const baseDescription =
    options.description || CREATOR_BIO;
  const ogImage = options.ogImage || DEFAULT_OG_IMAGE;
  const url = options.url || SITE_URL;
  const canonical = options.canonical || url;

  return {
    title: baseTitle,
    description: baseDescription,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonical,
    },
    keywords: [
      ...(options.keywords || []),
      "creator",
      "filmmaker",
      "content creator",
      "portfolio",
      "video content",
      "cinematography",
    ],
    authors: [{ name: options.author || CREATOR_NAME }],
    creator: CREATOR_NAME,
    publisher: CREATOR_NAME,
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
    robots: options.robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    openGraph: {
      type: options.ogType || "website",
      url: url,
      title: options.ogTitle || baseTitle,
      description: options.ogDescription || baseDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: options.ogTitle || baseTitle,
          type: "image/jpeg",
        },
        {
          url: ogImage,
          width: 800,
          height: 418,
          alt: options.ogTitle || baseTitle,
          type: "image/jpeg",
        },
      ],
      locale: "en_US",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      site: CREATOR_HANDLE,
      creator: CREATOR_HANDLE,
      title: options.ogTitle || baseTitle,
      description: options.ogDescription || baseDescription,
      images: [ogImage],
    },
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    appleMobileWebAppCapable: true,
    appleMobileWebAppStatusBarStyle: "black-translucent",
    appLinks: {
      ios: [
        {
          app_store_id: "585027354",
          app_name: "Instagram",
          url: SOCIAL_LINKS.instagram,
        },
      ],
      android: [
        {
          package: "com.instagram.android",
          app_name: "Instagram",
          url: SOCIAL_LINKS.instagram,
        },
      ],
    },
  };
}

/**
 * Generate page title with site name
 */
export function generateTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_NAME}`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string = ""): string {
  return `${SITE_URL}${path}`;
}

/**
 * Optimize image URL for OG
 */
export function optimizeOgImage(url: string): string {
  if (url.includes("i.ytimg.com")) {
    return url.replace("/hqdefault.jpg", "/maxresdefault.jpg");
  }
  return url;
}

/**
 * Generate Twitter card metadata
 */
export function getTwitterCardMetadata(
  title: string,
  description: string,
  image: string
) {
  return {
    card: "summary_large_image",
    title,
    description,
    image,
  };
}

/**
 * Keywords for different page types
 */
export const PAGE_KEYWORDS = {
  home: [
    "creator portfolio",
    "video content creator",
    "filmmaker",
    "cinematography",
    "YouTube content",
    "Instagram reels",
    "content creator for hire",
    "commercial video production",
    "travel vlogger",
  ],
  portfolio: [
    "portfolio projects",
    "client work",
    "commercial content",
    "brand campaigns",
    "video production",
    "project showcase",
  ],
  travel: [
    "travel content",
    "travel vlog",
    "travel filmmaker",
    "destination content",
    "travel videography",
  ],
  products: [
    "product content",
    "e-commerce content",
    "product videography",
    "commercial content",
    "brand content creation",
  ],
  events: [
    "event content",
    "event videography",
    "event filmmaker",
    "event coverage",
    "live event content",
  ],
};

/**
 * Get meta description based on length constraints
 */
export function optimizeMetaDescription(
  description: string,
  maxLength: number = 160
): string {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength - 3) + "...";
}
