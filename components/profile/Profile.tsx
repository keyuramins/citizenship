"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert } from "../ui/alert";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { supabaseBrowserClient } from "../../lib/supabaseClient";

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

  async function handleResetPassword() {
    setError("");
    setSuccess("");
    if (!supabaseBrowserClient) {
      setError("Supabase client not available.");
      return;
    }
    const { error } = await supabaseBrowserClient.auth.resetPasswordForEmail(email);
    if (error) setError("Failed to send reset email");
    else setSuccess("Password reset email sent");
    setShowReset(false);
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

  if (loading) return <div>Loading...</div>;

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
        {success && <Alert variant="default" className="mb-4">{success}</Alert>}
        <div className="mb-4">
          <Label htmlFor="displayName">Display Name</Label>
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
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            className="mt-1"
            value={email}
            disabled
          />
        </div>
        <div className="mb-4">
          <Dialog open={showReset} onOpenChange={setShowReset}>
            <DialogTrigger asChild>
              <Button variant="outline">Reset Password</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>
                  Send password reset email to <span className="font-semibold">{email}</span>?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={handleResetPassword}>Send Email</Button>
                <Button variant="ghost" onClick={() => setShowReset(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-4">
          <Dialog open={showDelete} onOpenChange={setShowDelete}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  <span className="text-red-700 font-semibold">
                    Warning: This action is irreversible. Your account and all data will be deleted.
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Confirm Delete
                </Button>
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