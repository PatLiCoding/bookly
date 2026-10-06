import { createClient } from "@supabase/supabase-js";

/**
 * Central Supabase client instance initialized with project credentials
 * sourced from environment variables.
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
