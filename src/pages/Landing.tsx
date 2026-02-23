import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Lock, Users, CheckCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <span className="text-lg font-bold text-primary tracking-tight">EscrowShield</span>
          <Button asChild size="sm">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Shield className="h-4 w-4" /> Secure Escrow Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Safe transactions between buyers and sellers
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Hold funds securely until both parties are satisfied. Dispute resolution included.
        </p>
        <Button asChild size="lg">
          <Link to="/auth">
            Start a Transaction <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Lock, title: 'Funds Held Securely', desc: 'Money is held in escrow until delivery is confirmed by the buyer.' },
            { icon: Users, title: 'Buyer and Seller Protection', desc: 'Both parties are protected with clear terms and dispute resolution.' },
            { icon: CheckCircle, title: 'Simple Workflow', desc: 'Create, fund, deliver, confirm, and release in a few clicks.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
