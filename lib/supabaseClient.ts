'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Usage:
// - On the server: pass a cookies object (from next/headers or similar)
// - On the client: use the singleton export

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: async () => (await cookieStore).getAll(),
      setAll: async (cookiesToSet) => {
        for (const cookie of cookiesToSet) {
          (await cookieStore).set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });
} 