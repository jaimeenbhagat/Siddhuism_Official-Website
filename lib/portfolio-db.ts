export type PortfolioCategory = "travel" | "products" | "events";
export type PortfolioProjectFilter = "all" | PortfolioCategory;

export type PortfolioVideo = {
  id: string;
  title: string;
  project_slug: string;
  project_title: string;
  video_url: string;
  thumbnail: string;
  category: PortfolioCategory;
  is_featured: boolean;
  created_at: string;
};

export type PortfolioProjectSummary = {
  project_slug: string;
  project_title: string;
  category: PortfolioCategory;
  thumbnail: string;
  video_count: number;
  is_featured: boolean;
  created_at: string;
};

export const PORTFOLIO_TABS = [
  { key: "all", label: "All" },
  { key: "travel", label: "Travel & Hospitality" },
  { key: "products", label: "E-Commerce" },
  { key: "events", label: "Events" },
] as const;

export type PortfolioTabKey = (typeof PORTFOLIO_TABS)[number]["key"];
