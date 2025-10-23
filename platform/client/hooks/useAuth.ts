import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && !url.includes("placeholder") && !key.includes("placeholder");
};

interface UserData {
  id: string;
  email: string;
  name: string | null;
  role: string;
  tenantId: string;
  supabaseUid: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userData: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Auth hook running in development mode.");
      setAuthState((prev) => ({ ...prev, loading: false }));
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState((prev) => ({ ...prev, session, user: session?.user || null }));
      if (session?.user) {
        fetchUserData(session.access_token, session.user);
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState((prev) => ({ ...prev, session, user: session?.user || null }));

      if (session?.user) {
        fetchUserData(session.access_token, session.user);
      } else {
        setAuthState({
          user: null,
          session: null,
          userData: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (token: string, currentUser: any) => {
    try {
      // Check if backend API is available
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000, // 5 second timeout
      });

      setAuthState((prev) => ({
        ...prev,
        userData: response.data.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.warn("Backend API not available, using Supabase user data only:", error.message);

      // Fallback: Use Supabase user data directly
      if (currentUser) {
        const fallbackUserData = {
          id: currentUser.id,
          email: currentUser.email || '',
          name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
          role: 'owner',
          tenantId: currentUser.user_metadata?.tenant_id || 'default',
          supabaseUid: currentUser.id,
        };

        setAuthState((prev) => ({
          ...prev,
          userData: fallbackUserData,
          loading: false,
          error: null,
        }));
      } else {
        setAuthState((prev) => ({
          ...prev,
          userData: null,
          loading: false,
          error: null, // Don't show error for missing backend in development
        }));
      }
    }
  };

  return authState;
};

