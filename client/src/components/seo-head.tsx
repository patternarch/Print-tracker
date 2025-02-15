import { Helmet } from "react-helmet";
import { generateMetaTags, generateStructuredData, generateCanonicalUrl } from "@/lib/seo-utils";
import type { StructuredData, MetaTag } from "@/lib/seo-utils";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  structuredData?: StructuredData;
  canonical?: string;
  noindex?: boolean;
}

export default function SEOHead({ 
  title, 
  description, 
  keywords,
  image,
  structuredData,
  canonical,
  noindex
}: SEOHeadProps) {
  const metaTags = generateMetaTags({ title, description, keywords, image });
  const defaultStructuredData = generateStructuredData("WebPage", {
    name: title,
    description,
    image
  });

  if (noindex) {
    metaTags.push({ name: "robots", content: "noindex, nofollow" });
  }

  return (
    <Helmet>
      <title>{title}</title>
      {metaTags.map((tag: MetaTag, index: number) => (
        <meta
          key={index}
          {...(tag.name ? { name: tag.name } : {})}
          {...(tag.property ? { property: tag.property } : {})}
          content={tag.content}
        />
      ))}
      {canonical && <link rel="canonical" href={generateCanonicalUrl(canonical)} />}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
}