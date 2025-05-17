"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "../lib/supabaseBrowserClient";
import { Button } from "./ui/button";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();
  const supabase = supabaseBrowserClient;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    if (!supabase) {
      setError("Supabase client not initialized");
      setLoading(false);
      return;
    }
    if (!displayName.trim()) {
      setError("Display Name is required");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName }
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      if (data?.user && !data.session) {
        setMessage("Verification email sent! Please check your inbox to confirm your email address.");
      } else if (data?.user && data.session) {
        setMessage("Registration successful! You are now logged in.");
      } else {
        setMessage("Registration complete. Please check your email for further instructions.");
      }
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

  useEffect(() => {
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "USER_UPDATED") {
        setMessage("Email confirmed! You can now log in.");
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 rounded-xl shadow bg-card border border-border">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Register</h1>
        <div className="mb-4">
          <input
            id="displayName"
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full p-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        {message && (
          <div className="mb-4 text-green-600 flex flex-col items-center">
            {message}
            {message.toLowerCase().includes("log in") && (
              <Button
                className="mt-2"
                onClick={() => window.location.href = "/login"}
              >
                Login
              </Button>
            )}
          </div>
        )}
        <Button
          type="submit"
          className="w-full mb-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
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
          {loading ? "Redirecting..." : "Register with Google"}
        </Button>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
} 