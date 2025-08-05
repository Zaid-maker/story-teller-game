import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";
import { Header } from "@/components/Header";
import { AvatarUpload } from "@/components/AvatarUpload";
import { PageLoader } from "@/components/PageLoader";

const Account = () => {
  const { user, session, profile, refetchProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/login");
    }
  }, [authLoading, session, navigate]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const updateProfile = async () => {
    try {
      setUpdateLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username: username,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
      showSuccess("Profile updated successfully!");
      refetchProfile();
    } catch (error: any) {
      showError(error.message);
    } finally {
      setUpdateLoading(false);
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
    return <PageLoader />;
  }

  if (!session || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Update your account settings. Your email is {user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AvatarUpload
              userId={user.id}
              url={avatarUrl}
              onUpload={(url) => {
                setAvatarUrl(url);
              }}
            />
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                disabled={updateLoading}
              />
               <p className="text-sm text-muted-foreground">This will be your name on the leaderboard.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleSignOut} disabled={updateLoading}>
              Sign Out
            </Button>
            <Button onClick={updateProfile} disabled={updateLoading}>
              {updateLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Account;