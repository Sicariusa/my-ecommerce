import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For client components - with fallback for development
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClientComponentClient()
    : createClient(
        supabaseUrl || "https://placeholder.supabase.co",
        supabaseAnonKey || "placeholder-key"
    );

// For server-side or when you need a standalone client
export const createSupabaseClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase environment variables not found. Using placeholder values for development.");
        return createClient(
            "https://placeholder.supabase.co",
            "placeholder-key"
        );
    }

    return createClient(supabaseUrl, supabaseAnonKey);
};

export default supabase;
