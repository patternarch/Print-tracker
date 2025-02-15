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

      <main>
        <section className="relative py-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Professional Print Tracking for Architects
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Streamline your blueprint printing workflow with comprehensive tracking, organization, and analytics.
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-16">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="rounded-lg p-6 bg-card">
                <img
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625"
                  alt="Blueprint tracking"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Print Tracking</h3>
                <p className="text-muted-foreground">
                  Track and manage all your blueprint prints in one place
                </p>
              </div>

              <div className="rounded-lg p-6 bg-card">
                <img
                  src="https://images.unsplash.com/photo-1469198629071-b7d66775e2fa"
                  alt="Project organization"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Project Organization</h3>
                <p className="text-muted-foreground">
                  Organize prints by project and client for easy access
                </p>
              </div>

              <div className="rounded-lg p-6 bg-card">
                <img
                  src="https://images.unsplash.com/photo-1562155695-fb6e1f95fcfd"
                  alt="Print analytics"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Print Analytics</h3>
                <p className="text-muted-foreground">
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