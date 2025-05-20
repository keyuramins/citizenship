import { createSupabaseServerClient } from '../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import { generateRandomizedTests } from "../../lib/generateRandomizedTests";
import { getStripeProductsWithPrices } from "../../lib/stripeClient";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import SubscribeButton from "../../components/SubscribeButton";

export default async function RandomPracticeTestsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const tests = await generateRandomizedTests();
  const products = await getStripeProductsWithPrices();
  const upgradePriceId = products?.[0]?.prices?.[0]?.id || "";
  const isPremium = !!user?.user_metadata?.subscription;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Random Practice Tests</h1>
        {!isPremium && (
          <SubscribeButton priceId={upgradePriceId} label="Upgrade Now" />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {tests.map((test, i) => {
          // For random tests, all are locked for free users
          const locked = !isPremium;
          return (
            <div key={i} className="border border-border rounded-lg p-4 bg-card relative">
              <div className="font-semibold text-lg mb-1">Practice Test {i + 1}</div>
              <div className="text-sm text-muted-foreground mb-4">Randomized citizenship practice test with 20 questions.</div>
              <div className="space-y-2">
                {locked ? (
                  <Button variant="secondary" disabled className="w-full border border-gray-500">Premium Only</Button>
                ) : (
                  <>
                    <Button asChild className="w-full">
                      <Link href={`/tests/random/${i + 1}`}>Start Test</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/tests/random/${i + 1}/stats`}>View Statistics</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 