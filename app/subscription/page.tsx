import { createSupabaseServerClient } from '../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import { getStripeProductsWithPrices } from "../../lib/stripeClient";
import SubscriptionManagement from "../../components/dashboard/SubscriptionManagement";

export default async function SubscriptionPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const products = await getStripeProductsWithPrices();
  const upgradePriceId = products?.[0]?.prices?.[0]?.id || "";
  return <SubscriptionManagement upgradePriceId={upgradePriceId} />;
} 