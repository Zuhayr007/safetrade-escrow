import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from './NotificationBell';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, LayoutDashboard, Plus, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, hasRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = (
    <>
      <Button variant="ghost" size="sm" asChild onClick={() => setOpen(false)}>
        <Link to="/dashboard">
          <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild onClick={() => setOpen(false)}>
        <Link to="/transactions/new">
          <Plus className="h-4 w-4 mr-1" /> New
        </Link>
      </Button>
      {hasRole('admin') && (
        <Button variant="ghost" size="sm" asChild onClick={() => setOpen(false)}>
          <Link to="/admin">
            <Shield className="h-4 w-4 mr-1" /> Admin
          </Link>
        </Button>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to={user ? '/dashboard' : '/'} className="text-lg font-bold text-primary tracking-tight">
            EscrowShield
          </Link>

          {user && (
            <>
              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-2">
                {navItems}
                <NotificationBell />
                <span className="text-sm text-muted-foreground">
                  {profile?.display_name || profile?.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile nav */}
              <div className="flex md:hidden items-center gap-1">
                <NotificationBell />
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-2 mt-4">
                      {navItems}
                      <div className="border-t border-border my-2" />
                      <span className="text-sm text-muted-foreground px-3">
                        {profile?.display_name || profile?.email}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => { setOpen(false); handleSignOut(); }}>
                        <LogOut className="h-4 w-4 mr-1" /> Sign Out
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
