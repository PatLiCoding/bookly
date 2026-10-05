import { createClient } from "@supabase/supabase-js";

/** Central Supabase client for the entire app. */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
