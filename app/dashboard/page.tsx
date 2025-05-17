import { createSupabaseServerClient } from '../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import { generateSequentialTests } from "../../lib/generateSequentialTests";
import { generateRandomizedTests } from "../../lib/generateRandomizedTests";
import PracticeTestsTabs from "../../components/dashboard/PracticeTestsTabs";
import { getStripeProductsWithPrices } from "../../lib/stripeClient";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Generate all tests server-side
  const sequentialTests = await generateSequentialTests();
  const randomizedTests = await generateRandomizedTests();
  const products = await getStripeProductsWithPrices();
  const upgradePriceId = products?.[0]?.prices?.[0]?.id || "";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <PracticeTestsTabs sequentialTests={sequentialTests} randomizedTests={randomizedTests} upgradePriceId={upgradePriceId} />
    </div>
  );
} 