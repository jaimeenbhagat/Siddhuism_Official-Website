/**
 * JSON-LD Schema Generation for Structured Data
 * Provides schema markup for rich snippets and SEO
 */

import { SITE_URL, CREATOR_NAME, CREATOR_HANDLE, CREATOR_BIO, SOCIAL_LINKS } from "./seo";

export type SchemaType = any;

/**
 * Generate Person schema for the creator
 */
export function generatePersonSchema(): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: CREATOR_NAME,
    url: SITE_URL,
    description: CREATOR_BIO,
    image: `${SITE_URL}/profile.jpg`,
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.linkedin,
    ],
    jobTitle: "Content Creator & Filmmaker",
    knowsAbout: [
      "Cinematography",
      "Video Production",
      "Content Creation",
      "Travel Videography",
      "Commercial Content",
      "Motion Graphics",
    ],
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: CREATOR_NAME,
    url: SITE_URL,
    description: CREATOR_BIO,
    image: `${SITE_URL}/profile.jpg`,
    telephone: "+91", // Add your phone number
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.twitter,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      url: SITE_URL,
    },
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebsiteSchema(): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: CREATOR_NAME,
    url: SITE_URL,
    description: CREATOR_BIO,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/portfolio?q={search_term_string}`,
      },
      query_input: "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate VideoObject schema for portfolio videos
 */
export function generateVideoSchema(options: {
  name: string;
  description?: string;
  thumbnailUrl: string;
  uploadDate?: string;
  duration?: string;
  url: string;
}): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: options.name,
    description: options.description,
    thumbnailUrl: [options.thumbnailUrl],
    uploadDate: options.uploadDate || new Date().toISOString(),
    duration: options.duration || "PT5M",
    contentUrl: options.url,
    embedUrl: options.url,
  };
}

/**
 * Generate CreativeWork schema for portfolio projects
 */
export function generateCreativeWorkSchema(options: {
  name: string;
  description?: string;
  creator?: string;
  dateCreated?: string;
  image?: string;
  url: string;
  genre?: string;
}): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: options.name,
    description: options.description,
    creator: {
      "@type": "Person",
      name: options.creator || CREATOR_NAME,
    },
    dateCreated: options.dateCreated,
    image: options.image,
    url: options.url,
    genre: options.genre || "Video Production",
  };
}

/**
 * Generate Portfolio/WebPage schema
 */
export function generateWebPageSchema(options: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.title,
    description: options.description,
    image: options.image,
    url: options.url,
    datePublished: options.datePublished,
    dateModified: options.dateModified || new Date().toISOString(),
    creator: {
      "@type": "Person",
      name: CREATOR_NAME,
    },
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate AggregateOffer schema for services
 */
export function generateAggregateOfferSchema(options: {
  name: string;
  description?: string;
  offers: Array<{
    name: string;
    price: string;
    currency?: string;
  }>;
}): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: options.name,
    description: options.description,
    provider: {
      "@type": "Person",
      name: CREATOR_NAME,
    },
    offers: {
      "@type": "AggregateOffer",
      offers: options.offers.map((offer) => ({
        "@type": "Offer",
        name: offer.name,
        price: offer.price,
        priceCurrency: offer.currency || "INR",
      })),
    },
  };
}

/**
 * Merge multiple schemas into @graph format
 */
export function generateGraphSchema(...schemas: SchemaType[]): SchemaType {
  return {
    "@context": "https://schema.org",
    "@graph": schemas.map((schema) => {
      // Remove @context from individual schemas since @graph has it
      const { "@context": _, ...rest } = schema;
      return rest;
    }),
  };
}

/**
 * Convert schema to JSON string for script tag
 */
export function schemaToString(schema: SchemaType): string {
  return JSON.stringify(schema);
}
