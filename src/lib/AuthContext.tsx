import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthState = {
  session: Session | null;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthState>({ session: null, loading: true, error: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const { data: existing } = await supabase.auth.getSession();
      if (existing.session) {
        if (mounted) {
          setSession(existing.session);
          setLoading(false);
        }
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInAnonymously();
      if (!mounted) return;
      if (signInError) {
        setError(signInError.message);
      } else {
        setSession(data.session);
      }
      setLoading(false);
    }

    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) setSession(newSession);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, error }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
