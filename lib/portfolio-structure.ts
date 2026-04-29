export type VideoLink = {
  url: string;
  type: "video" | "short";
  id: string;
};

export type BrandCategory = {
  name: string;
  description?: string;
  videos: VideoLink[];
};

export type PortfolioCategory = {
  title: string;
  brands: BrandCategory[];
};

export type PortfolioSection = {
  title: string;
  description: string;
  categories: PortfolioCategory[];
};

export type PortfolioProject = {
  slug: string;
  name: string;
  displayName: string;
  description?: string;
  categoryTitle: string;
  videos: VideoLink[];
};

function parseVideo(url: string): VideoLink {
  const cleanUrl = url.split('&')[0]; // Remove playlist parameters
  if (cleanUrl.includes("/shorts/")) {
    const id = cleanUrl.split("/shorts/")[1].split("?")[0];
    return { url: cleanUrl, type: "short", id };
  } else if (cleanUrl.includes("watch?v=")) {
    const id = cleanUrl.split("watch?v=")[1].split("&")[0];
    return { url: cleanUrl, type: "video", id };
  } else if (cleanUrl.includes("youtu.be/")) {
    const id = cleanUrl.split("youtu.be/")[1].split("?")[0];
    return { url: cleanUrl, type: "video", id };
  }
  return { url: cleanUrl, type: "video", id: "unknown" };
}

export function getBrandDisplayName(brandName: string) {
  return brandName.split("|")[0].trim();
}

export function getBrandSlug(brandName: string) {
  return getBrandDisplayName(brandName)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const PORTFOLIO_DATA: PortfolioSection[] = [
  {
    title: "Commercial Work (The \"Money\" Section)",
    description: "Proving the ability to handle big budgets and brand guidelines.",
    categories: [
      {
        title: "Travel & Hospitality",
        brands: [
          {
            name: "The Hosteller | Community Living & Backpacker Hostels",
            videos: [
              "https://www.youtube.com/watch?v=GlucobCFSes",
              "https://www.youtube.com/watch?v=iCgcMb1AcqA",
              "https://www.youtube.com/watch?v=j1M9hCaklxc"
            ].map(parseVideo)
          },
          {
            name: "The Forest Club Resort | Luxury Resorts & Nature Retreats",
            videos: [
              "https://www.youtube.com/shorts/Pzrgbny81Ho",
              "https://www.youtube.com/shorts/ygm0R8J4oIY"
            ].map(parseVideo)
          }
        ]
      },
      {
        title: "Consumer Goods & E-Commerce",
        brands: [
          {
            name: "Orange Cookware | Premium Kitchenware & Home Essentials",
            videos: [
              "https://www.youtube.com/shorts/QPi7ygzH5uc",
              "https://www.youtube.com/shorts/YgA41sqd9IU",
              "https://www.youtube.com/shorts/KXKmfhPpSAM",
              "https://www.youtube.com/shorts/A2IEH9nPtaw",
              "https://www.youtube.com/shorts/xG35L7t9uFs",
              "https://www.youtube.com/shorts/Ep0b_nzkWtQ",
              "https://www.youtube.com/shorts/Xpn1KG3nwZ0",
              "https://www.youtube.com/shorts/YbdD_fG4Gyg",
              "https://www.youtube.com/shorts/pYpaqABi2_4",
              "https://www.youtube.com/shorts/T54it3jNr38",
              "https://www.youtube.com/shorts/Q4v0kKO-xbw",
              "https://www.youtube.com/shorts/ubjOhC_SLS4",
              "https://www.youtube.com/shorts/FIyZhiLIUIY",
              "http://youtube.com/shorts/ldHRvV5Tae0",
              "https://www.youtube.com/shorts/TKZssyrK9Lg",
              "https://www.youtube.com/shorts/ZQ-wiN7fNcs",
              "https://www.youtube.com/shorts/pWLOTPrTBhg",
              "http://youtube.com/shorts/AUggjxKTxYY"
            ].map(parseVideo)
          },
          {
            name: "Flipkart | Fashion & E-commerce Lifestyle",
            videos: [
              "https://www.youtube.com/shorts/4TwTfhRFHK4",
              "https://www.youtube.com/shorts/BNOjko5yq8I",
              "https://www.youtube.com/shorts/hf1cfFd2Tyk",
              "https://www.youtube.com/shorts/MUyzDpwK99c",
              "https://www.youtube.com/shorts/LNC04KEAiXo",
              "https://www.youtube.com/shorts/SGoFaqMnua4",
              "https://www.youtube.com/shorts/DzAYr2XI8NI",
              "https://www.youtube.com/shorts/0KBvSCr0oYg",
              "https://www.youtube.com/shorts/rB6-vBKr7mM",
              "https://www.youtube.com/shorts/bCxnZsMBqTE",
              "https://www.youtube.com/shorts/sn6VX3dV1Yo",
              "https://www.youtube.com/shorts/dxyg31h2C9Q",
              "https://www.youtube.com/shorts/F9VHDUhKalQ",
              "https://www.youtube.com/shorts/nL5_RMpESmo",
              "https://www.youtube.com/shorts/5iZ-xmgfF04",
              "https://www.youtube.com/shorts/OBz3HKX05G4",
              "https://www.youtube.com/shorts/fP5eMRwVOuM",
              "https://www.youtube.com/shorts/XUh-XBPpKsU",
              "https://www.youtube.com/shorts/IIMEAmnrcbM",
              "https://www.youtube.com/shorts/6akAlEgLqbk",
              "https://www.youtube.com/shorts/y3Rl0-y9a4I",
              "https://www.youtube.com/shorts/tuFHqrH1gEA",
              "https://www.youtube.com/shorts/F0ds4DXDpko",
              "https://www.youtube.com/shorts/wpzWHJtPKfk",
              "https://www.youtube.com/shorts/n-vHr-fmn4U",
              "https://www.youtube.com/shorts/6FgugaaNKn8",
              "https://www.youtube.com/shorts/4H_JGYreTso",
              "https://www.youtube.com/shorts/8vPKC2fqlw0",
              "https://www.youtube.com/shorts/VYMEosyk488",
              "https://www.youtube.com/shorts/WvC8_iyptgo",
              "https://www.youtube.com/shorts/eLWFuu4vpNI",
              "https://www.youtube.com/shorts/UfurLGh78a0",
              "https://www.youtube.com/shorts/UlIcikIpE48",
              "https://www.youtube.com/shorts/a4sv1bdxpHk",
              "https://www.youtube.com/shorts/ipD14IzH_dg",
              "https://www.youtube.com/shorts/qvHP6e-E70U",
              "https://www.youtube.com/shorts/8rhb8688F-s",
              "https://www.youtube.com/shorts/vqYgLIoz3iY",
              "https://www.youtube.com/shorts/AiWSAsGHHeg",
              "https://www.youtube.com/shorts/-7jfYLenHKw",
              "https://www.youtube.com/shorts/vSkpFCDi5ag",
              "https://www.youtube.com/shorts/PZESk7ms8F4",
              "https://www.youtube.com/shorts/Hm-PC3k-Yq4",
              "https://www.youtube.com/shorts/scjVV9IhLaw",
              "https://www.youtube.com/shorts/SLHyMqSeRvM"
            ].map(parseVideo)
          },
          {
            name: "Bagzone | Tech Accessories & Professional Gear",
            description: "One video manual upload which has copyright",
            videos: [
              "https://www.youtube.com/shorts/_qh2CdO3fik",
              "https://www.youtube.com/shorts/ZF832646ugs"
            ].map(parseVideo)
          }
        ]
      },
      {
        title: "Events & Experiences",
        brands: [
          {
            name: "Synergy Banquet | Corporate Events & Hospitality Spaces",
            videos: [
              "https://www.youtube.com/shorts/HYBgRXHpqzM"
            ].map(parseVideo)
          },
          {
            name: "Rvoice Events | Live Events & Public Relations",
            description: "Pending Edits",
            videos: [
              "https://www.youtube.com/watch?v=64wPib17LQo"
            ].map(parseVideo)
          }
        ]
      }
    ]
  },
  {
    title: "Specialized Cinematography",
    description: "Showcasing technical skills that are hard to replicate. These are \"niche\" reels.",
    categories: [
      {
        title: "Automotive & Motion",
        brands: [
          {
            name: "The Himalayan Series",
            description: "High-speed tracking shots, exhaust sound design, and rugged terrain cinematography. Skills: Precision tracking, mount-shots, and mechanical soundscapes.",
            videos: [
              "https://www.youtube.com/watch?v=jOhX_Z29AOY",
              "https://www.youtube.com/watch?v=pAc4KHX6dsU",
              "https://www.youtube.com/watch?v=2OEd5betEp8",
              "https://www.youtube.com/watch?v=HwT0tLosRZI"
            ].map(parseVideo)
          }
        ]
      },
      {
        title: "Sports & High-Performance",
        brands: [
          {
            name: "Surfing",
            description: "High-energy edits, slow-motion impact shots, and athletic storytelling.",
            videos: [
              "https://www.youtube.com/shorts/aVDopci6w2w",
              "https://www.youtube.com/shorts/J0TEojJ5i0c",
              "https://www.youtube.com/shorts/jhcjDGu0vQA",
              "https://www.youtube.com/shorts/rzqs4B-xQlI",
              "https://www.youtube.com/shorts/J2k4mpHg52w"
            ].map(parseVideo)
          },
          {
            name: "Gym & Strength Training",
            videos: [
              "https://www.youtube.com/shorts/7ZRYlto2Fdw",
              "https://www.youtube.com/shorts/NT_-rbNzlhU",
              "https://www.youtube.com/shorts/RdvmXkT21QI",
              "https://www.youtube.com/shorts/bw_LxeHSZSk",
              "https://www.youtube.com/shorts/IhKZURbHKOo",
              "https://www.youtube.com/shorts/qkai5CExi_U",
              "https://www.youtube.com/shorts/KuqlIo_2nQ8"
            ].map(parseVideo)
          },
          {
            name: "Cricket & Pickleball",
            videos: [
              "https://www.youtube.com/watch?v=KwO0ec7Oz0c",
              "https://www.youtube.com/watch?v=0534wxLzkjo",
              "https://www.youtube.com/watch?v=FQs-ghqaBaA",
              "https://www.youtube.com/watch?v=d-kVRCCemg8",
              "https://www.youtube.com/watch?v=auh8tw80xgQ",
              "https://www.youtube.com/watch?v=hYgv6efzlEo",
              "https://www.youtube.com/watch?v=bw0GWMbJgHE"
            ].map(parseVideo)
          }
        ]
      }
    ]
  },
  {
    title: "Narrative & Exploration",
    description: "This shows the \"Director\" side—storytelling and long-form content.",
    categories: [
      {
        title: "Travel Vlogs & Visual Journeys",
        brands: [
          {
            name: "Ladakh: The Great Himalayan Journey",
            description: "Coming Soon",
            videos: [
              "https://www.youtube.com/shorts/2xLNnWJrT1c",
              "https://www.youtube.com/shorts/g3Noox3VJAo",
              "http://youtube.com/shorts/rXCFB93NxSQ",
              "https://www.youtube.com/shorts/e3DjnpnN-SM",
              "https://www.youtube.com/shorts/WHFrxTYl7vE",
              "https://www.youtube.com/shorts/qZNyyFQehe8",
              "https://www.youtube.com/shorts/_eWOV7bwp54",
              "https://www.youtube.com/shorts/p4vbX8Sylg4",
              "https://www.youtube.com/shorts/eK6LWfVZfxk",
              "https://www.youtube.com/shorts/iQIvy4MT9iU",
              "https://www.youtube.com/shorts/QXIfdjdC9Uk",
              "https://www.youtube.com/shorts/J4UsG15u1_g",
              "https://www.youtube.com/shorts/_oiDROi_4_s",
              "https://www.youtube.com/shorts/4bUIeIjYA0w",
              "https://www.youtube.com/shorts/JXCMean1N3Y",
              "https://www.youtube.com/shorts/odEaIO6t2Fk",
              "https://www.youtube.com/shorts/R7ics3GkCIQ",
              "https://www.youtube.com/shorts/ufeuYx_rQcw",
              "https://www.youtube.com/shorts/Apfp6pUBvNw"
            ].map(parseVideo)
          },
          {
            name: "Vrindavan: Cultural Exploration",
            description: "WIP",
            videos: []
          }
        ]
      }
    ]
  },
  {
    title: "Influence & Authority",
    description: "Proving active participation in the industry and behind-the-scenes mastery.",
    categories: [
      {
        title: "Media & Public Appearances",
        brands: [
          {
            name: "Industry Events",
            description: "Book Launch (Featuring Pratik Gandhi & CID Cast), VCT Valorant LAN. Connected with public figures and high-profile gaming/tech communities.",
            videos: [
              "https://www.youtube.com/shorts/0CiQBNy2IFg",
              "https://www.youtube.com/shorts/-XTHbVpsLRE",
              "https://www.youtube.com/shorts/iwpg5OKjz8M",
              "https://www.youtube.com/shorts/PtmoKTaCxVw",
              "https://www.youtube.com/shorts/BDnw_ukiilo"
            ].map(parseVideo)
          }
        ]
      },
      {
        title: "Process & BTS (The \"How-To\")",
        brands: [
          {
            name: "Shot vs. Setup",
            description: "Technical breakdowns of how to achieve cinematic lighting and angles.",
            videos: [
              "https://www.youtube.com/shorts/bkc4iJ6OA9U",
              "https://www.youtube.com/shorts/E7BZLpr99is",
              "https://www.youtube.com/shorts/dNHCvliQiqo"
            ].map(parseVideo)
          }
        ]
      }
    ]
  }
];

export const HERO_REEL = parseVideo("https://www.youtube.com/watch?v=2Un0Nrx1bHI");

export function getAllPortfolioProjects(): PortfolioProject[] {
  return PORTFOLIO_DATA.flatMap((section) =>
    section.categories.flatMap((category) =>
      category.brands.map((brand) => ({
        slug: getBrandSlug(brand.name),
        name: brand.name,
        displayName: getBrandDisplayName(brand.name),
        description: brand.description,
        categoryTitle: category.title,
        videos: brand.videos,
      })),
    ),
  );
}

export function getPortfolioProjectBySlug(slug: string): PortfolioProject | undefined {
  return getAllPortfolioProjects().find((project) => project.slug === slug);
}
