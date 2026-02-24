import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowRight,
  Lock,
  Users,
  CheckCircle,
  BadgeCheck,
  Clock3,
  FileText,
  Gavel,
  ChevronRight,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-border">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-primary tracking-tight">
              EscrowShield
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-12">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          {/* subtle gradient */}
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="relative px-6 py-14 md:px-12 md:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-border">
                <Shield className="h-4 w-4" />
                Secure escrow for modern deals
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Safe transactions between buyers and sellers
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Agree on terms, fund the transaction, track delivery, and release
                only when both sides are satisfied. Built-in dispute handling keeps
                everything fair and transparent.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/auth">
                    Start a Transaction <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <a href="#how-it-works">
                    How it works <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  Clear terms
                </span>
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Secure workflow
                </span>
                <span className="inline-flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-primary" />
                  Dispute resolution
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: Lock,
              title: "Funds held securely",
              desc: "Payments are treated as held until delivery is confirmed, so nobody gets burned.",
            },
            {
              icon: Users,
              title: "Buyer and seller protection",
              desc: "Both parties agree to the same terms, with full visibility and a clean paper trail.",
            },
            {
              icon: CheckCircle,
              title: "Simple, guided workflow",
              desc: "Create, fund, deliver, confirm, release. No confusion, no back-and-forth.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-xl p-6 text-center shadow-sm"
            >
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-3 border border-border">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container mx-auto px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              How EscrowShield works
            </h2>
            <p className="text-muted-foreground mt-2">
              A clean flow designed to keep both sides confident from start to finish.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            {[
              {
                icon: FileText,
                title: "1. Set the terms",
                desc: "Buyer creates a transaction with price, delivery details, and expectations.",
              },
              {
                icon: Users,
                title: "2. Seller accepts",
                desc: "Seller reviews the terms and confirms before any funding happens.",
              },
              {
                icon: Clock3,
                title: "3. Track delivery",
                desc: "Mark delivered, share proof, and keep everything visible on the timeline.",
              },
              {
                icon: BadgeCheck,
                title: "4. Release funds",
                desc: "Buyer confirms receipt, then funds are released (or a dispute is opened).",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border border-border">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold leading-tight">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-xl font-bold tracking-tight mb-2">
              Trust and transparency by design
            </h3>
            <p className="text-muted-foreground mb-6">
              Every action is recorded on a timeline. Both parties always know what is
              happening and what the next step is.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Audit timeline",
                  desc: "Events are logged from creation to release for accountability.",
                },
                {
                  title: "Dispute support",
                  desc: "Open a dispute, upload evidence, and let an admin resolve fairly.",
                },
                {
                  title: "Role-based access",
                  desc: "Buyers and sellers only see their own deals. Admins can oversee safely.",
                },
              ].map((i) => (
                <div key={i.title} className="flex gap-3">
                  <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 border border-border">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium leading-tight">{i.title}</p>
                    <p className="text-sm text-muted-foreground">{i.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-2">
                Ready to start your first escrow deal?
              </h3>
              <p className="text-muted-foreground mb-6">
                Create a transaction, invite a seller, and manage the entire flow in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/auth">
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <a href="#how-it-works">View the workflow</a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Tip: Keep your transaction terms clear. Clear terms reduce disputes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} EscrowShield. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <Link to="/auth" className="hover:text-foreground transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}