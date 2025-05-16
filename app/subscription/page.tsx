import { getStripeProductsWithPrices } from "../../lib/stripeClient";
import SubscriptionManagement from "../../components/dashboard/SubscriptionManagement";

export default async function SubscriptionPage() {
  const products = await getStripeProductsWithPrices();
  const upgradePriceId = products?.[0]?.prices?.[0]?.id || "";
  return <SubscriptionManagement upgradePriceId={upgradePriceId} />;
} 