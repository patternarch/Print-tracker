import { z } from "zod";

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface StructuredData {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: any;
}

export const keywordSchema = z.object({
  term: z.string().min(1),
  relevance: z.number().min(0).max(1),
  volume: z.number().optional(),
  difficulty: z.number().optional()
});

export type Keyword = z.infer<typeof keywordSchema>;

export function generateStructuredData(type: string, data: any): StructuredData {
  const baseStructure = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  if (type === "Organization") {
    return {
      ...baseStructure,
      name: "PrintTrack",
      description: "Professional Print Tracking for Architects",
      url: window.location.origin,
    };
  }

  if (type === "Service") {
    return {
      ...baseStructure,
      provider: {
        "@type": "Organization",
        name: "PrintTrack"
      },
      serviceType: "Print Management",
      ...data
    };
  }

  return baseStructure;
}

export function generateCanonicalUrl(path: string): string {
  return `${window.location.origin}${path}`;
}

export function generateMetaTags(data: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
}): MetaTag[] {
  const { title, description, keywords, image } = data;
  const tags: MetaTag[] = [
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "robots", content: "index, follow" }
  ];

  if (keywords?.length) {
    tags.push({ name: "keywords", content: keywords.join(", ") });
  }

  if (image) {
    tags.push(
      { property: "og:image", content: image },
      { name: "twitter:image", content: image }
    );
  }

  return tags;
}

export function analyzeSEOScore(content: {
  title?: string;
  description?: string;
  keywords?: string[];
  headings?: string[];
  content?: string;
}): {
  score: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 100;

  // Title analysis
  if (!content.title) {
    score -= 20;
    suggestions.push("Add a title to improve SEO");
  } else if (content.title.length < 30 || content.title.length > 60) {
    score -= 10;
    suggestions.push("Title length should be between 30-60 characters");
  }

  // Description analysis
  if (!content.description) {
    score -= 20;
    suggestions.push("Add a meta description to improve SEO");
  } else if (content.description.length < 120 || content.description.length > 160) {
    score -= 10;
    suggestions.push("Description length should be between 120-160 characters");
  }

  // Keywords analysis
  if (!content.keywords?.length) {
    score -= 10;
    suggestions.push("Add relevant keywords to improve visibility");
  }

  // Headings analysis
  if (!content.headings?.length) {
    score -= 10;
    suggestions.push("Add headings (H1, H2, etc.) to structure your content");
  }

  return {
    score: Math.max(0, score),
    suggestions
  };
}
