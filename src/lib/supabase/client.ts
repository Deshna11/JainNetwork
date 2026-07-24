import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client (for use in Client Components)
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  return createBrowserClient(url, key);
}
