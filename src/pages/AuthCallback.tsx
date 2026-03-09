import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(true);
    }, 10000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        clearTimeout(timeout);
        navigate('/dashboard', { replace: true });
      }
    });

    // Also check if already signed in (back-button scenario)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        clearTimeout(timeout);
        navigate('/dashboard', { replace: true });
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-destructive font-medium">Sign-in failed or session expired.</p>
        <button
          onClick={() => navigate('/auth', { replace: true })}
          className="text-primary underline"
        >
          Return to login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Completing sign-in...</p>
    </div>
  );
}
