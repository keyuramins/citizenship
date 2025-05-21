import { createSupabaseServerClient } from '../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import { generateSequentialTests } from "../../lib/generateSequentialTests";
import { getStripeProductsWithPrices } from "../../lib/stripeClient";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import SubscribeButton from "../../components/SubscribeButton";
import { fetchTestTypeAverages } from '../../lib/testResults';
import { Card, CardContent } from '../../components/ui/card';
import { format, formatDistanceToNow } from 'date-fns';

export default async function GuidedPracticeTestsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const tests = await generateSequentialTests();
  const products = await getStripeProductsWithPrices();
  const upgradePriceId = products?.[0]?.prices?.[0]?.id || "";
  const isPremium = !!user?.user_metadata?.subscription;

  const averages = await fetchTestTypeAverages(user.id, 'guided');

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Guided Practice Tests</h1>
          {!isPremium && (
            <SubscribeButton priceId={upgradePriceId} label="Upgrade Now" />
          )}
        </div>
        {averages && (
          <Card className="shadow-md border bg-card/90">
            <CardContent className="flex flex-wrap items-center gap-6 py-4 px-6 justify-between">
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">AVG SCORE</span>
                <span className={`text-2xl font-bold ${averages.avgScore >= 75 ? 'text-green-500' : 'text-red-500'}`}>{averages.avgScore}%</span>
              </div>
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">TOTAL ATTEMPTS</span>
                <span className="text-xl font-semibold">{averages.totalAttempts}</span>
              </div>
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">PASS RATE</span>
                <span className={`text-lg font-bold ${averages.passRate >= 75 ? 'text-green-500' : 'text-red-500'}`}>{averages.passRate}%</span>
              </div>
              {averages.lastAttempted && (
                <div className="flex flex-col items-center min-w-[120px]">
                  <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">LAST ATTEMPTED</span>
                  <span className="text-sm font-medium" title={format(new Date(averages.lastAttempted), 'PPpp')}>
                    {formatDistanceToNow(new Date(averages.lastAttempted), { addSuffix: true })}
                  </span>
                </div>
              )}
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">VALUES</span>
                <span className="text-lg font-semibold">{averages.avgValues}%</span>
              </div>
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">GOVT</span>
                <span className="text-lg font-semibold">{averages.avgGovernment}%</span>
              </div>
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">BELIEFS</span>
                <span className="text-lg font-semibold">{averages.avgBeliefs}%</span>
              </div>
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">PEOPLE</span>
                <span className="text-lg font-semibold">{averages.avgPeople}%</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {tests.map((test, i) => {
          const isFree = i < 5;
          const locked = !isPremium && !isFree;
          return (
            <div key={i} className="border border-border rounded-lg p-4 bg-card relative">
              <div className="font-semibold text-lg mb-1">Practice Test {i + 1}</div>
              <div className="text-sm text-muted-foreground mb-4">Guided citizenship practice test with 20 questions.</div>
              <div className="space-y-2">
                {locked ? (
                  <Button variant="secondary" disabled className="w-full border border-gray-500">Premium Only</Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`/tests/guided/${i + 1}`}>Start Test</Link>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 