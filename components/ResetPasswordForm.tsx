"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "../lib/supabaseBrowserClient";
import { Button } from "./ui/button";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const supabase = supabaseBrowserClient;

  useEffect(() => {
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setShowForm(true);
      }
    });
    // Show form by default (for direct navigation)
    setShowForm(true);
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    if (!supabase) {
      setError("Supabase client not initialized");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated! You can now log in with your new password.");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow border border-border">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Reset Password</h1>
        <p className="text-muted-foreground text-sm mb-4">Enter your new password below.</p>
        <p className="text-muted-foreground text-sm mb-4">Your new password must be different from your previous password. Must be at least 12 characters long.</p>
        {showForm ? (
          <form onSubmit={handleReset}>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
            {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
            {message && <div className="mt-4 text-green-600 text-sm">{message}</div>}
          </form>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
} 