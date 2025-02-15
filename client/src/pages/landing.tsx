import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/seo-head";
import { generateStructuredData } from "@/lib/seo-utils";

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

            <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
              <div className="rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Print Tracking</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Track and manage all your blueprint prints in one place
                </p>
              </div>

              <div className="rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Project Organization</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Organize prints by project and client for easy access
                </p>
              </div>

              <div className="rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Print Analytics</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Gain insights into your printing patterns and usage
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}