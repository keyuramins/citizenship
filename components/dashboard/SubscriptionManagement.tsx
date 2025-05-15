"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { supabaseBrowserClient } from "../../lib/supabaseClient";

export default function SubscriptionManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState<string | null>(null);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSub() {
      setLoading(true);
      setError("");
      const { data, error } = await supabaseBrowserClient.auth.getUser();
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

  async function openPortal() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) {
        setPortalUrl(url);
        window.location.href = url;
      } else {
        setError("Could not open portal");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Manage Subscription</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <div className="font-semibold">Current Plan:</div>
        <div>{subscription ? "Premium" : "Free"}</div>
      </div>
      <Button onClick={openPortal} disabled={loading || !subscription}>
        {subscription ? "Manage Subscription" : "Upgrade to Premium"}
      </Button>
    </div>
  );
} 