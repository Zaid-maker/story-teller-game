import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";

const Login = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      navigate("/");
    }
  }, [session, loading, navigate]);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      showError(error.message);
    }
    setFormLoading(false);
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Success! Please check your email for a confirmation link.");
    }
    setFormLoading(false);
  };

  if (loading || session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isSigningUp ? "Join the Adventure" : "Welcome Back!"}
          </CardTitle>
          <CardDescription>
            {isSigningUp
              ? "Create an account to start playing."
              : "Sign in to continue your adventure."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={isSigningUp ? handleSignUp : handleSignIn}>
          <CardContent className="space-y-4">
            {isSigningUp && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="adventurer"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={formLoading}>
              {formLoading
                ? isSigningUp
                  ? "Creating Account..."
                  : "Signing In..."
                : isSigningUp
                ? "Sign Up"
                : "Sign In"}
            </Button>
          </CardContent>
        </form>
        <CardFooter>
          <p className="w-full text-center text-sm text-muted-foreground">
            {isSigningUp
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsSigningUp(!isSigningUp)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {isSigningUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;