import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let browserSupabaseClient: ReturnType<typeof createBrowserClient> | null = null;

function ensureSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
}

export function getBrowserSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("Supabase browser client must be initialized in the browser.");
  }

  ensureSupabaseEnv();

  if (!browserSupabaseClient) {
    browserSupabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  return browserSupabaseClient;
}
