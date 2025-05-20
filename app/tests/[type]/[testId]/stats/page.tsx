import { createSupabaseServerClient } from '../../../../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import { getTestStats } from '../../../../../lib/testStats';
import { TestStatistics } from '../../../../../components/tests/TestStatistics';
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';
import { TestType } from '../../../../../lib/types';

export default async function TestStatsPage({ params }: { params: { type: string; testId: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Validate test type
  if (!['guided', 'sequential', 'random'].includes(params.type)) {
    redirect('/dashboard');
  }

  const testId = parseInt(params.testId, 10);
  const stats = await getTestStats(user.id, params.type as TestType, testId);

  if (!stats) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">No Statistics Available</h1>
          <p className="text-muted-foreground mb-4">
            You haven't attempted this test yet. Take the test to see your statistics.
          </p>
          <Button asChild>
            <Link href={`/tests/${params.type}/${params.testId}`}>
              Take Test
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Test Statistics</h1>
          <Button asChild>
            <Link href={`/tests/${params.type}/${params.testId}`}>
              Take Test Again
            </Link>
          </Button>
        </div>
        <TestStatistics stats={stats} testNumber={testId} />
      </div>
    </div>
  );
} 