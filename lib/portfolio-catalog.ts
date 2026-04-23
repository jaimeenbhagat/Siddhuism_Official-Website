export type PortfolioFilter = "all" | "commercial" | "automotive" | "travel" | "bts";

export type PortfolioProject = {
  id: string;
  title: string;
  label: string;
  video_url: string;
  thumbnail: string;
  tags: PortfolioFilter[];
  sectionId: "commercial" | "specialized" | "narrative" | "influence";
  subsectionId: string;
  comingSoon?: boolean;
};

export type PortfolioSubsection = {
  id: string;
  title: string;
  description: string;
};

export type PortfolioSectionConfig = {
  id: "commercial" | "specialized" | "narrative" | "influence";
  title: string;
  subsections: PortfolioSubsection[];
};

export const PORTFOLIO_FILTERS: Array<{ key: PortfolioFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "commercial", label: "Commercial" },
  { key: "automotive", label: "Automotive" },
  { key: "travel", label: "Travel" },
  { key: "bts", label: "BTS" },
];

export const PORTFOLIO_SECTIONS: PortfolioSectionConfig[] = [
  {
    id: "commercial",
    title: "Section 1: Commercial Work",
    subsections: [
      { id: "travel-hospitality", title: "A. Travel & Hospitality", description: "The Hosteller • The Forest Club Resort" },
      { id: "consumer-goods", title: "B. Consumer Goods & E-Commerce", description: "Orange Cookware • Flipkart • Bagzone" },
      { id: "events-experiences", title: "C. Events & Experiences", description: "Synergy Banquet • Rvoice Events" },
    ],
  },
  {
    id: "specialized",
    title: "Section 2: Specialized Cinematography",
    subsections: [
      { id: "automotive-motion", title: "D. Automotive & Motion", description: "Himalayan Series" },
      { id: "sports-performance", title: "E. Sports & High-Performance", description: "Surfing • Gym • Cricket • Pickleball" },
    ],
  },
  {
    id: "narrative",
    title: "Section 3: Narrative & Exploration",
    subsections: [
      { id: "travel-vlogs", title: "F. Travel Vlogs", description: "Ladakh (Coming Soon) • Vrindavan" },
    ],
  },
  {
    id: "influence",
    title: "Section 4: Influence & Authority",
    subsections: [
      { id: "media-public", title: "G. Media & Public Appearances", description: "Book Launch • VCT Valorant LAN • Hosteller Holi Event" },
      { id: "process-bts", title: "H. Process & BTS", description: "Scripting → Shooting → Editing" },
    ],
  },
];

export const BASE_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "hosteller",
    title: "The Hosteller",
    label: "Travel & Hospitality",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "commercial", "travel"],
    sectionId: "commercial",
    subsectionId: "travel-hospitality",
  },
  {
    id: "forest-club",
    title: "The Forest Club Resort",
    label: "Travel & Hospitality",
    video_url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    thumbnail: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210f8?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "commercial", "travel"],
    sectionId: "commercial",
    subsectionId: "travel-hospitality",
  },
  {
    id: "orange-cookware",
    title: "Orange Cookware",
    label: "Consumer Goods",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "commercial"],
    sectionId: "commercial",
    subsectionId: "consumer-goods",
  },
  {
    id: "flipkart",
    title: "Flipkart",
    label: "E-Commerce",
    video_url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    thumbnail: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "commercial"],
    sectionId: "commercial",
    subsectionId: "consumer-goods",
  },
  {
    id: "bagzone",
    title: "Bagzone",
    label: "E-Commerce",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "commercial"],
    sectionId: "commercial",
    subsectionId: "consumer-goods",
  },
  {
    id: "synergy-banquet",
    title: "Synergy Banquet",
    label: "Events",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "commercial"],
    sectionId: "commercial",
    subsectionId: "events-experiences",
  },
  {
    id: "rvoice-events",
    title: "Rvoice Events",
    label: "Events",
    video_url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    thumbnail: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "commercial"],
    sectionId: "commercial",
    subsectionId: "events-experiences",
  },
  {
    id: "himalayan-series",
    title: "Himalayan Series",
    label: "Automotive & Motion",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "automotive"],
    sectionId: "specialized",
    subsectionId: "automotive-motion",
  },
  {
    id: "sports-reel",
    title: "Surfing • Gym • Cricket • Pickleball",
    label: "Sports Performance",
    video_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "bts"],
    sectionId: "specialized",
    subsectionId: "sports-performance",
  },
  {
    id: "ladakh",
    title: "Ladakh",
    label: "Travel Vlog",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnail: "https://images.unsplash.com/photo-1464822759844-d150ad6d1dd0?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "travel"],
    sectionId: "narrative",
    subsectionId: "travel-vlogs",
    comingSoon: true,
  },
  {
    id: "vrindavan",
    title: "Vrindavan",
    label: "Travel Vlog",
    video_url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    thumbnail: "https://images.unsplash.com/photo-1599661046227-d85a519f7f7c?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "travel"],
    sectionId: "narrative",
    subsectionId: "travel-vlogs",
  },
  {
    id: "book-launch",
    title: "Book Launch (Pratik Gandhi & CID Cast)",
    label: "Media Appearance",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
    tags: ["all"],
    sectionId: "influence",
    subsectionId: "media-public",
  },
  {
    id: "vct-lan",
    title: "VCT Valorant LAN",
    label: "Media Appearance",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    tags: ["all"],
    sectionId: "influence",
    subsectionId: "media-public",
  },
  {
    id: "hosteller-holi",
    title: "Hosteller Holi Event",
    label: "Public Event",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    tags: ["all"],
    sectionId: "influence",
    subsectionId: "media-public",
  },
  {
    id: "workflow-bts",
    title: "Shot vs Setup Workflow",
    label: "Process & BTS",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    tags: ["all", "bts"],
    sectionId: "influence",
    subsectionId: "process-bts",
  },
];
