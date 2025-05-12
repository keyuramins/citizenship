import { createBrowserClient, createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Usage:
// - On the server: pass a cookies object (from next/headers or similar)
// - On the client: use the singleton export

export function createSupabaseServerClient(cookies: any) {
  return createServerClient(supabaseUrl, supabaseKey, { cookies });
}

export const supabaseBrowserClient =
  typeof window !== 'undefined'
    ? createBrowserClient(supabaseUrl, supabaseKey)
    : undefined; 