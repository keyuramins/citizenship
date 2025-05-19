import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  // Get the user's session from the cookie
  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Create a Supabase client with the user's access token for RLS
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  // Get the user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'User not found or not authenticated' }, { status: 401 });
  }

  // Check for active subscription in user_metadata
  const meta = user.user_metadata || {};
  const hasActiveSub = !!meta.subscription;

  if (hasActiveSub) {
    // Soft delete: append scheduled_account_deletion: true
    const newMeta = { ...meta, scheduled_account_deletion: true };
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { user_metadata: newMeta });
    if (updateError) {
      return NextResponse.json({ error: 'Failed to schedule account deletion', details: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ status: 'scheduled', message: 'Account deletion scheduled after subscription ends.' });
  } else {
    // Hard delete
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete account', details: deleteError.message }, { status: 500 });
    }
    return NextResponse.json({ status: 'deleted', message: 'Account deleted successfully.' });
  }
} 