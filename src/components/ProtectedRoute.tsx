import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { AppRole } from '@/types/escrow';

interface Props {
  children: ReactNode;
  requiredRole?: AppRole;
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // Replace current history entry so back button stays on the current protected page
      window.history.replaceState(null, '', location.pathname + location.search);

      const handlePopState = () => {
        // Push the current protected route back to prevent navigating to auth pages
        window.history.pushState(null, '', location.pathname + location.search);
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [user, location.pathname, location.search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (requiredRole && !hasRole(requiredRole)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
