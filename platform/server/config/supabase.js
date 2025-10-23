import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
        "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

// Helper to verify JWT tokens
export async function verifySupabaseToken(token) {
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error) throw error;
        return user;
    } catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
}

console.log("✅ Supabase client initialized successfully");

export default supabase;
