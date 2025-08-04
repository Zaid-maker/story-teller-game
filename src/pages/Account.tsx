import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

const Account = () => {
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/login");
    }
  }, [authLoading, session, navigate]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setProfileLoading(true);
        if (!user) throw new Error("No user");

        const { data, error, status } = await supabase
          .from("profiles")
          .select(`username`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
        }
      } catch (error: any) {
        showError(error.message);
      } finally {
        setProfileLoading(false);
      }
    };

    if (user) {
      getProfile();
    }
  }, [user]);

  const updateProfile = async () => {
    try {
      setProfileLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
      showSuccess("Profile updated successfully!");
    } catch (error: any) {
      showError(error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError(error.message);
    } else {
      navigate("/login");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Update your account settings. Your email is {user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              disabled={profileLoading}
            />
             <p className="text-sm text-muted-foreground">This will be your name on the leaderboard.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSignOut} disabled={profileLoading}>
            Sign Out
          </Button>
          <Button onClick={updateProfile} disabled={profileLoading}>
            {profileLoading ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Account;