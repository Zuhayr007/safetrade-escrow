import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { AppRole } from "@/types/escrow";

interface Props {
  children: ReactNode;
  requiredRole?: AppRole;
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading, hasRole, profile } = useAuth();
  const location = useLocation();

  // Prevent back navigation to auth pages
  useEffect(() => {
    if (!user) return;

    const handlePopState = () => {
      window.history.pushState(null, "", location.pathname);
    };

    window.history.pushState(null, "", location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [user, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Check KYC status — redirect to pending page if not approved
  if (profile && profile.kyc_status !== "approved") {
    return <Navigate to="/kyc-pending" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}