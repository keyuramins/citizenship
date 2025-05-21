// app/tests/[type]/[testId]/page.tsx
import { createSupabaseServerClient } from '../../../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import { generateSequentialTests } from "../../../../lib/generateSequentialTests";
import { generateRandomizedTests } from "../../../../lib/generateRandomizedTests";
import PracticeTestClient from "../../../../components/tests/PracticeTestClient";
import { notFound } from "next/navigation";
import { getStripeProductsWithPrices } from "../../../../lib/stripeClient";
import { shuffle } from "../../../../lib/testUtils";
import { fetchTestResultForTest } from '../../../../lib/testResults';

export default async function TestPage({ params }: { params: Promise<{ type: string; testId: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { type, testId } = await params;
  let tests;
  if (type === "sequential" || type === "guided") {
    tests = await generateSequentialTests();
  } else if (type === "random") {
    tests = await generateRandomizedTests();
  } else {
    notFound();
  }
  const idx = parseInt(testId, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= tests.length) {
    notFound();
  }

  // Server-side: check subscription status
  const isPremium = !!user?.user_metadata?.subscription;

  // ENFORCE ACCESS RULES
  if (type === "random" && !isPremium) {
    // Block all random tests for free users
    redirect('/random');
  }
  if ((type === "sequential" || type === "guided") && !isPremium && idx >= 5) {
    // Block test 6+ for free users
    redirect(`/${type}`);
  }

  let questions = type === "random" ? shuffle(tests[idx]) : tests[idx];

  // Fetch Stripe products and get the first priceId
  const products = await getStripeProductsWithPrices();
  const upgradePriceId = products?.[0]?.prices?.[0]?.id || "";

  // Fetch previous test result for HUD
  const testResult = await fetchTestResultForTest(user.id, type, parseInt(testId, 10));

  return (
    <div className="p-8">
      <PracticeTestClient
        questions={questions}
        isPremium={isPremium}
        upgradePriceId={upgradePriceId}
        testId={testId}
        mode={type}
        testResult={testResult}
      />
    </div>
  );
} 