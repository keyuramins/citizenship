import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key required
);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  // Use Supabase Auth admin API to list all users and filter by email
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error || !data || !data.users || data.users.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const user = data.users.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const provider = user?.app_metadata?.provider;
  return NextResponse.json({ provider });
} 