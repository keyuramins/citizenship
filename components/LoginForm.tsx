"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "../lib/supabaseBrowserClient";
import { Button } from "./ui/button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = supabaseBrowserClient;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!supabase) {
      setError("Supabase client not initialized");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    if (!supabase) {
      setError("Supabase client not initialized");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    setLoading(false);
    if (error) setError(error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 rounded-xl shadow bg-card border border-border">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Login</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-foreground font-medium">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-foreground font-medium">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <Button
          type="submit"
          className="w-full mb-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <br />
        <p className="text-center text-muted-foreground text-sm my-3">Or</p>
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mb-2 bg-foreground text-background hover:bg-foreground/90"
          disabled={loading}
          variant="secondary"
        >
          {loading ? "Redirecting..." : "Login with Google"}
        </Button>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account? <a href="/register" className="text-primary hover:underline">Register</a>
          <br />
          <a href="/forgot-password" className="text-primary hover:underline">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
} 