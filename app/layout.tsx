import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://siddhuism-official.vercel.app"),
  title: "siddhuism_official | Creator Portfolio",
  description:
    "Premium single-page portfolio for siddhuism_official featuring cinematic content showcases, interactive video previews, and collaboration enquiry flow.",
  openGraph: {
    title: "siddhuism_official | Creator Portfolio",
    description:
      "Explore travel, lifestyle, reels, and edits in a high-performance portfolio built with Next.js.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "siddhuism_official | Creator Portfolio",
    description:
      "Modern creator portfolio with smooth motion, category filters, and viewport autoplay videos.",
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#06070f] text-slate-100" suppressHydrationWarning>{children}</body>
    </html>
  );
}
