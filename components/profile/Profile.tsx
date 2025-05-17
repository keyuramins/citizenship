"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert } from "../ui/alert";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { supabaseBrowserClient } from "../../lib/supabaseBrowserClient";
import Link from "next/link";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      if (!supabaseBrowserClient) {
        setError("Supabase client not available.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabaseBrowserClient.auth.getUser();
      if (error) {
        setError("Failed to load user");
      } else {
        setUser(data.user);
        setDisplayName(data.user.user_metadata?.displayName || data.user.user_metadata?.full_name || "");
        setEmail(data.user.email ?? "");
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    if (!supabaseBrowserClient) {
      setError("Supabase client not available.");
      setSaving(false);
      return;
    }
    const { error } = await supabaseBrowserClient.auth.updateUser({ data: { displayName } });
    if (error) setError("Failed to update display name");
    else setSuccess("Display name updated");
    setSaving(false);
  }

  async function handleChangePassword() {
    setPasswordError("");
    setPasswordSuccess("");
    if (!supabaseBrowserClient) {
      setPasswordError("Supabase client not available.");
      return;
    }
    if (!newPassword || newPassword.length < 12) {
      setPasswordError("Password must be at least 12 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    const { error } = await supabaseBrowserClient.auth.updateUser({ password: newPassword });
    if (error) setPasswordError(error.message || "Failed to update password");
    else setPasswordSuccess("Password updated successfully.");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleDeleteAccount() {
    setError("");
    setSuccess("");
    if (!supabaseBrowserClient) {
      setError("Supabase client not available.");
      return;
    }
    // TODO: Check for active Stripe subscription before allowing deletion
    const { error } = await supabaseBrowserClient.rpc("delete_user"); // You may need a custom function
    if (error) setError("Failed to delete account");
    else setSuccess("Account deleted");
    setShowDelete(false);
  }

  const hasActiveSubscription = !!user?.user_metadata?.subscription;

  if (loading) return <div>Loading...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
        {success && <Alert variant="default" className="mb-4">{success}</Alert>}
        <div className="mb-4 border border-border rounded p-4">
          <Label htmlFor="displayName" className="text-xl font-semibold">Display Name</Label>
          <Input
            id="displayName"
            className="mt-1"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            disabled={saving}
          />
          <Button className="mt-2" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
        <div className="mb-4 border border-border rounded p-4">
          <Label htmlFor="email" className="text-xl font-semibold">Email</Label>
          <Input
            id="email"
            className="mt-1"
            value={email}
            disabled
          />
        </div>
        <div className="mb-4 border border-border rounded p-4">
          {/* Only show password change for email/password users */}
          {user?.raw_app_meta_data?.provider === 'google' ? (
            <div className="text-muted-foreground text-sm">You signed up with Google. Password change is not available for Google login accounts.</div>
          ) : user?.app_metadata?.provider === 'email' && (
            <div className="border border-border rounded p-4">
              <div className="text-xl font-semibold mb-2">Change Password</div>
              <p className="text-muted-foreground text-sm mb-3">Must be at least 12 characters long.</p>
              <div className="mb-2">
                <Label htmlFor="newPassword" className="text-lg font-semibold">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="mt-2"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
              <div className="my-3">
                <Label htmlFor="confirmPassword" className="text-lg font-semibold">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="mt-2"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button className="mt-2" onClick={handleChangePassword} disabled={saving}>
                Change Password
              </Button>
              {passwordError && <Alert variant="destructive" className="mt-2">{passwordError}</Alert>}
              {passwordSuccess && <Alert variant="default" className="mt-2">{passwordSuccess}</Alert>}
            </div>
          )}
          {user && !user.raw_app_meta_data?.provider && user?.app_metadata?.provider !== 'email' && (
            <div className="text-muted-foreground text-sm">Password change is not available for social login accounts.</div>
          )}
        </div>
        <div className="mb-4">
          <Dialog open={showDelete} onOpenChange={setShowDelete}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={hasActiveSubscription}>
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  {hasActiveSubscription ? (
                    <span className="text-red-700 font-semibold">
                      You have an active subscription. Please cancel your subscription before deleting your account.
                    </span>
                  ) : (
                    <span className="text-red-700 font-semibold">
                      Warning: This action is irreversible. Your account and all data will be deleted.
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={hasActiveSubscription}>
                  Confirm Delete
                </Button>
                {hasActiveSubscription && (
                  <Button asChild variant="outline">
                    <Link href="/subscription">Manage Subscription</Link>
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setShowDelete(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
} 