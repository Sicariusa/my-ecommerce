import { supabase } from "./supabase";
import axios from "axios";
import type { User } from "@supabase/supabase-js";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && !url.includes("placeholder") && !key.includes("placeholder");
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  tenantId: string
) => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Development mode - simulate successful signup
      console.warn("Supabase not configured. Running in development mode.");

      // Simulate a successful signup for development
      const mockUser = {
        id: `dev-user-${Date.now()}`,
        email,
        user_metadata: { name, tenant_id: tenantId },
        created_at: new Date().toISOString(),
      };

      const mockSession = {
        access_token: `dev-token-${Date.now()}`,
        refresh_token: `dev-refresh-${Date.now()}`,
        user: mockUser,
      };

      return { user: mockUser, session: mockSession };
    }

    // Create Supabase user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          tenant_id: tenantId,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("User creation failed");

    // Check if user needs email confirmation
    if (data.user && !data.session) {
      // User created but needs email confirmation
      return {
        user: data.user,
        session: null,
        needsConfirmation: true,
        message: "Please check your email and click the confirmation link to complete your registration."
      };
    }

    // User is immediately confirmed (if email confirmation is disabled)
    if (data.session) {
      // Create user in your database
      try {
        await axios.post(
          `${API_URL}/api/auth/register`,
          {
            email,
            name,
            tenantId,
            supabaseUid: data.user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          }
        );
      } catch (dbError) {
        console.warn("Failed to create user in database:", dbError);
        // Continue anyway - user is created in Supabase
      }

      return { user: data.user, session: data.session };
    }

    throw new Error("Unexpected signup response");
  } catch (error: any) {
    throw new Error(error.message || "Sign up failed");
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Development mode - simulate successful signin
      console.warn("Supabase not configured. Running in development mode.");

      // Simulate a successful signin for development
      const mockUser = {
        id: `dev-user-${Date.now()}`,
        email,
        user_metadata: { name: "Development User" },
        created_at: new Date().toISOString(),
      };

      const mockSession = {
        access_token: `dev-token-${Date.now()}`,
        refresh_token: `dev-refresh-${Date.now()}`,
        user: mockUser,
      };

      return { user: mockUser, session: mockSession };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.session) {
      throw new Error("Sign in successful but no session created. Please try again.");
    }

    return {
      user: data.user,
      session: data.session,
    };
  } catch (error: any) {
    throw new Error(error.message || "Sign in failed");
  }
};

// Sign out
export const logout = async () => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Simulating logout in development mode.");
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    throw new Error(error.message || "Sign out failed");
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    return null;
  }
};

// Get current session
export const getSession = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    return null;
  }
};

// Get access token
export const getAccessToken = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.access_token || null;
};

// Auth state listener
export const onAuthStateChange = (
  callback: (event: string, session: any) => void
) => {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured. Auth state changes disabled in development mode.");
    return { data: { subscription: { unsubscribe: () => { } } } };
  }

  return supabase.auth.onAuthStateChange(callback);
};
