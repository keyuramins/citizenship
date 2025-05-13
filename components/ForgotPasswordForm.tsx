"use client";
import { useState } from "react";
import { supabaseBrowserClient } from "../lib/supabaseClient";
import { Button } from "./ui/button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = supabaseBrowserClient;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    if (!supabase) {
      setError("Supabase client not initialized");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent! Please check your inbox.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleForgotPassword} className="w-full max-w-sm p-8 rounded-xl shadow bg-card border border-border">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Forgot Password</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-foreground font-medium">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        {message && <div className="mb-4 text-green-600 text-sm">{message}</div>}
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </Button>
      </form>
    </div>
  );
} 