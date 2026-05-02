export type Category = "Travel & Hospitality" | "Products" | "Events";

export type VideoItem = {
  id: string;
  title: string;
  category: Exclude<Category, "All">;
  src: string;
  poster: string;
  duration: string;
};

export type HighlightItem = {
  title: string;
  description: string;
  metric: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: string;
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Live Social", href: "#youtube-hub" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Profile", href: "#profile" },
  { label: "Contact", href: "#contact" },
] as const;

export const TAGLINES = [
  "Cinematic storytelling built for modern feeds.",
  "Bold edits, premium pacing, and creator energy.",
  "Travel, lifestyle, and reels with a sharp visual identity.",
];

export const CATEGORIES: Category[] = [
  "Travel & Hospitality",
  "Products",
  "Events",
];

export const SOCIAL_LINKS = [
  { label: "YouTube", href: "https://www.youtube.com/@siddhuism_official" },
  { label: "Instagram", href: "https://www.instagram.com/siddhuism_official/" },
  { label: "Facebook", href: "https://www.facebook.com/siddharth.sonetta.1/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/siddhuismofficial/" },
  { label: "Threads", href: "https://www.threads.com/@siddhuism_official" },
  { label: "Mail", href: "mailto:siddhuismofficial@gmail.com" },
] as const;

export const VIDEO_ITEMS: VideoItem[] = [
  {
    id: "travel-1",
    title: "Sunrise Streets",
    category: "Travel & Hospitality",
    src: "https://assets.mixkit.co/videos/preview/mixkit-white-van-driving-on-road-4118-large.mp4",
    poster: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60",
    duration: "0:42",
  },
  {
    id: "product-1",
    title: "Premium Product Teaser",
    category: "Products",
    src: "https://assets.mixkit.co/videos/preview/mixkit-young-man-walking-in-the-city-1238-large.mp4",
    poster: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=60",
    duration: "1:08",
  },
  {
    id: "event-1",
    title: "Event Opening Reel",
    category: "Events",
    src: "https://assets.mixkit.co/videos/preview/mixkit-man-on-a-city-bridge-4230-large.mp4",
    poster: "https://images.unsplash.com/photo-1517638851339-a711cfcf3279?auto=format&fit=crop&w=1200&q=60",
    duration: "0:25",
  },
  {
    id: "travel-2",
    title: "Resort Story Cut",
    category: "Travel & Hospitality",
    src: "https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-4137-large.mp4",
    poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=60",
    duration: "0:37",
  },
  {
    id: "product-2",
    title: "Unbox To Conversion",
    category: "Products",
    src: "https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-laptop-4476-large.mp4",
    poster: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=60",
    duration: "0:54",
  },
  {
    id: "event-2",
    title: "Aftermovie Highlights",
    category: "Events",
    src: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-during-sunset-4830-large.mp4",
    poster: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=60",
    duration: "0:46",
  },
  {
    id: "travel-3",
    title: "Skyline Escape",
    category: "Travel & Hospitality",
    src: "https://assets.mixkit.co/videos/preview/mixkit-driving-on-an-open-road-on-a-sunny-day-4159-large.mp4",
    poster: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=60",
    duration: "0:49",
  },
];

export const HIGHLIGHTS: HighlightItem[] = [
  {
    title: "Viral Reels Sprint",
    description: "Three-week content sprint with short-form editing cadence and trend-aware hooks.",
    metric: "4.2M total views",
  },
  {
    title: "Travel Series",
    description: "Multi-city visual story series blending cinematic transitions with ambient storytelling.",
    metric: "58% avg retention",
  },
  {
    title: "Brand Collaboration",
    description: "Lifestyle launch campaign with vertical-first cuts tailored to platform behavior.",
    metric: "9.7% engagement",
  },
  {
    title: "Creator Masterclass Clips",
    description: "Educational shorts repurposed for discoverability while preserving high-end style.",
    metric: "1.1M monthly reach",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The content feels like a brand campaign every single time. The pacing, framing, and music choices are elite.",
    name: "Aarav Mehta",
    role: "Brand Strategist",
    rating: "5.0",
  },
  {
    quote:
      "His travel reels instantly grab attention. The edits feel energetic but still polished enough for premium collaborations.",
    name: "Kavya Nair",
    role: "Creative Director",
    rating: "4.9",
  },
  {
    quote:
      "Every frame has intent. The portfolio now feels like a serious creator presence instead of a basic showcase.",
    name: "Rohan Sethi",
    role: "Video Producer",
    rating: "5.0",
  },
];
