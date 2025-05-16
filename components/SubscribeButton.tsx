"use client";
import { useState } from "react";
import { Button } from "./ui/button";

export default function SubscribeButton({ priceId, label }: { priceId: string; label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to start checkout");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleSubscribe} disabled={loading} className="mt-2 w-full">
        {loading ? "Redirecting..." : (label || "Subscribe")}
      </Button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  );
} 