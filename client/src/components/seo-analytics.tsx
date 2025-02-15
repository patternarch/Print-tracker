import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeSEOScore } from "@/lib/seo-utils";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface SEOAnalyticsProps {
  pageData: {
    title?: string;
    description?: string;
    keywords?: string[];
    headings?: string[];
    content?: string;
  };
}

export default function SEOAnalytics({ pageData }: SEOAnalyticsProps) {
  const { score, suggestions } = analyzeSEOScore(pageData);
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          SEO Analysis
          <Badge className={getScoreColor(score)}>
            Score: {score}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.length > 0 ? (
            <div className="space-y-2">
              <h3 className="font-medium">Suggestions for Improvement:</h3>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-500" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-green-600">Great job! Your page is well optimized for search engines.</p>
          )}
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Current Page SEO Details:</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium">Title Length:</dt>
                <dd>{pageData.title?.length || 0} characters</dd>
              </div>
              <div>
                <dt className="font-medium">Description Length:</dt>
                <dd>{pageData.description?.length || 0} characters</dd>
              </div>
              <div>
                <dt className="font-medium">Keywords:</dt>
                <dd>{pageData.keywords?.join(", ") || "None specified"}</dd>
              </div>
              <div>
                <dt className="font-medium">Number of Headings:</dt>
                <dd>{pageData.headings?.length || 0}</dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
