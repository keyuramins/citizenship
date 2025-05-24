"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowserClient } from "../../lib/supabaseBrowserClient";

export default function RefreshSessionOnCheckout() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    async function refreshAndCheck() {
      if (searchParams.get("checkout") === "success") {
        await supabaseBrowserClient?.auth.getSession();
      }
      // Always check plan on mount
      const { data } = await supabaseBrowserClient?.auth.getUser() || {};
      if (data?.user?.user_metadata?.subscription) {
        setPlan("Premium");
      } else {
        setPlan("Free");
      }
    }
    refreshAndCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (plan === null) return null;
  return (
    <div className="mb-4 text-right text-sm text-muted-foreground">
      <span className="font-semibold">Current Plan:</span> {plan}
    </div>
  );
} 