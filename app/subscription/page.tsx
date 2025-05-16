import { getStripeProductsWithPrices } from "../../lib/stripeClient";
import dynamic from "next/dynamic";
const SubscriptionManagement = dynamic(() => import("../../components/dashboard/SubscriptionManagement"), { ssr: false });

export default async function SubscriptionPage() {
  const products = await getStripeProductsWithPrices();
  const upgradePriceId = products?.[0]?.prices?.[0]?.id || "";
  return <SubscriptionManagement upgradePriceId={upgradePriceId} />;
} 