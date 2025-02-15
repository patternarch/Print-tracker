import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/history", label: "Print History" },
  { href: "/analytics", label: "Analytics" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <span className="text-xl font-bold">PrintTrack</span>
          </a>
        </Link>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden lg:flex gap-6">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href}>
              <a
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </a>
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="container py-4 space-y-4">
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href}>
                <a
                  className={cn(
                    "block py-2 text-sm font-medium transition-colors hover:text-primary",
                    location === href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </a>
              </Link>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}