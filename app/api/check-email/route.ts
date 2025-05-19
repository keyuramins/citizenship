import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Query the auth.users table (Supabase Auth schema)
  const { data, error } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ exists: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exists: !!data });
} 