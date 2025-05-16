"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { supabaseBrowserClient } from "../../lib/supabaseBrowserClient";
import SubscribeButton from "../SubscribeButton";

export default function SubscriptionManagement({ upgradePriceId }: { upgradePriceId: string }) {
  if (!supabaseBrowserClient) return null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSub() {
      setLoading(true);
      setError("");
      const { data, error } = await supabaseBrowserClient!.auth.getUser();
      if (error) {
        setError("Failed to load user");
        setLoading(false);
        return;
      }
      setSubscription(data.user?.user_metadata?.subscription || null);
      setLoading(false);
    }
    fetchSub();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Manage Subscription</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <div className="font-semibold">Current Plan:</div>
        <div>{subscription ? "Premium" : "Free"}</div>
      </div>
      {!subscription ? (
        <SubscribeButton priceId={upgradePriceId} label="Upgrade Now" />
      ) : (
        <Button disabled className="w-full">You are already Premium</Button>
      )}
    </div>
  );
} 