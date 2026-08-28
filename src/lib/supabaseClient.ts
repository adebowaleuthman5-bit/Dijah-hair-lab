import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// True once real project credentials are present. Every service function
// in src/services/* checks this and falls back to the bundled demo data
// when it's false — so the app runs immediately with `npm run dev` and
// switches to live data the moment .env is filled in, with no code
// changes needed on the consuming side (hooks, pages, components).
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    '[DIJAH HAIR LAB] No Supabase credentials found in .env — running on demo data. ' +
      'See supabase/README.md to connect a real project.'
  );
}
