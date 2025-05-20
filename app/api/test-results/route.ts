// app/api/test-results/route.ts
import { createSupabaseServerClient } from '../../../lib/supabaseClient';
import { storeTestResult } from '../../../lib/testResults';
import { NextResponse } from 'next/server';
import { TestResult, TestType } from '../../../lib/types';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    
    if (!body.testType || !body.result) {
      return new NextResponse('Missing required fields: testType or result', { status: 400 });
    }
    
    const { testType, result } = body as { testType: TestType; result: TestResult };

    // Store the test result
    await storeTestResult(
      user.id,
      user.email || '',
      user.user_metadata?.full_name || '',
      testType,
      result
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing test result:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new NextResponse(message, { status: 500 });
  }
} 