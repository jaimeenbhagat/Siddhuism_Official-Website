"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import AboutSection from "@/components/about-section";
import BackToTop from "@/components/ui/back-to-top";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import LoadingScreen from "@/components/ui/loading-screen";
import Navbar from "@/components/navbar";
import YouTubeShortsPreview from "@/components/youtube-shorts-preview";
import ScrollProgress from "@/components/ui/scroll-progress";
import ProfileGallery from "@/components/profile-gallery";
import ClientLogoCarousel from "@/components/client-logo-carousel";

const YouTubeVideoGrid = dynamic(() => import("@/components/youtube-video-grid"));
const ContactSection = dynamic(() => import("@/components/contact-section"));

export default function PortfolioPage() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader ? <LoadingScreen /> : null}
      <ScrollProgress />
      <Navbar />

      <main className="relative overflow-hidden">
        <HeroSection
          onWatchClick={() => document.getElementById("youtube-hub")?.scrollIntoView({ behavior: "smooth" })}
          onContactClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        />
        <AboutSection />
        <YouTubeVideoGrid />
        <YouTubeShortsPreview />
        <ProfileGallery />
        <ClientLogoCarousel />
        <ContactSection />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
