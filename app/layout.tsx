import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { generatePageMetadata, SITE_URL, PAGE_KEYWORDS, generateGraphSchema, generatePersonSchema, generateWebsiteSchema } from "@/lib/seo";
import { schemaToString } from "@/lib/schema";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = generatePageMetadata({
  title: "siddhuism_official",
  description: "Creator, filmmaker, and content specialist. Crafting cinematic travel, lifestyle, and commercial content across multiple platforms.",
  ogTitle: "siddhuism_official | Creator Portfolio",
  ogDescription: "Explore premium commercial work, travel content, and brand collaborations. Professional portfolio by content creator siddhuism_official.",
  ogImage: `${SITE_URL}/og-image.jpg`,
  url: SITE_URL,
  keywords: PAGE_KEYWORDS.home,
  author: "Siddhuism Official",
  canonical: SITE_URL,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate schema markup
  const schemaMarkup = generateGraphSchema(
    generatePersonSchema(),
    generateWebsiteSchema()
  );

  return (
    <html lang="en" className={`${poppins.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Color scheme for browsers */}
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#06070f" media="(prefers-color-scheme: dark)" />

        {/* Additional SEO meta tags */}
        <meta name="revisit-after" content="7 days" />
        <meta name="msapplication-TileColor" content="#06070f" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: schemaToString(schemaMarkup),
          }}
          suppressHydrationWarning
        />

        {/* Google Site Verification (add your verification token) */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" /> */}

        {/* Preload critical images */}
        <link rel="preload" as="image" href="/og-image.jpg" imagesrcset="/og-image.jpg 1200w" imageSizes="(max-width: 1200px) 100vw, 1200px" />
      </head>

      <body 
        className="min-h-full flex flex-col overflow-x-hidden bg-[#06070f] text-slate-100" 
        suppressHydrationWarning
      >
        {children}

        {/* Google Analytics - Replace with your GA_ID */}
        {/* Uncomment and add your GA ID */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G_MEASUREMENT_ID', {
                page_path: window.location.pathname,
              });
            `,
          }}
        /> */}

        {/* Microsoft Clarity - Optional */}
        {/* Uncomment and add your Clarity ID */}
        {/* <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "YOUR_CLARITY_ID");`
          }}
        /> */}
      </body>
    </html>
  );
}
