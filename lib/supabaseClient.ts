'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Usage:
// - On the server: pass allowSetCookies: true ONLY in Route Handlers or Server Actions
// - In middleware or server components: use default (false)

export async function createSupabaseServerClient({ allowSetCookies = false } = {}) {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: async () => (await cookieStore).getAll(),
      setAll: allowSetCookies
        ? async (cookiesToSet) => {
            for (const cookie of cookiesToSet) {
              (await cookieStore).set(cookie.name, cookie.value, cookie.options);
            }
          }
        : async () => {}, // no-op if not allowed
    },
  });
} 