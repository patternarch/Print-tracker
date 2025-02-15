import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/seo-head";
import { generateStructuredData } from "@/lib/seo-utils";
import { Download, Printer, BarChart3, FolderKanban } from "lucide-react";

export default function Landing() {
  const structuredData = generateStructuredData("Service", {
    name: "PrintTrack - Professional Print Tracking",
    description: "Streamline your architectural print workflow with PrintTrack. Track, manage, and optimize your blueprint printing process efficiently.",
    provider: {
      "@type": "Organization",
      name: "PrintTrack",
      description: "Leading print management solution for architects"
    }
  });

  return (
    <>
      <SEOHead
        title="PrintTrack - Professional Print Tracking for Architects"
        description="Streamline your architectural print workflow with PrintTrack. Track, manage, and optimize your blueprint printing process efficiently."
        keywords={[
          "architectural print tracking",
          "blueprint management",
          "print workflow",
          "architect software",
          "print monitoring",
          "CAD printing",
          "professional printing"
        ]}
        structuredData={structuredData}
        canonical="/"
      />

      <main className="min-h-screen">
        <section className="relative py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Professional Print Tracking for Architects
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Streamline your blueprint printing workflow with comprehensive tracking, organization, and analytics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 md:mb-16 px-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-base md:text-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg">
                  Learn More
                </Button>
              </Link>
            </div>

            <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 mb-16">
              <div className="rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                <Printer className="w-8 h-8 mb-4 text-primary" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">Print Tracking</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Track and manage all your blueprint prints in one place
                </p>
              </div>

              <div className="rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                <FolderKanban className="w-8 h-8 mb-4 text-primary" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">Project Organization</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Organize prints by project and client for easy access
                </p>
              </div>

              <div className="rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                <BarChart3 className="w-8 h-8 mb-4 text-primary" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">Print Analytics</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Gain insights into your printing patterns and usage
                </p>
              </div>
            </div>

            {/* Download Section */}
            <div id="download" className="bg-card rounded-lg p-8 md:p-12 text-center max-w-4xl mx-auto">
              <Download className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Download PrintTrack Utility
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get our Windows print monitoring utility to automatically track and manage your architectural prints. Seamlessly integrates with your existing workflow.
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold">System Requirements:</h4>
                <ul className="text-sm text-muted-foreground">
                  <li>Windows 10 or later</li>
                  <li>4GB RAM minimum</li>
                  <li>.NET Framework 4.7.2 or later</li>
                  <li>Internet connection for print tracking</li>
                </ul>
              </div>

              <Button size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                Download for Windows (64-bit)
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Version 1.0.0 | Last updated: February 15, 2025
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}