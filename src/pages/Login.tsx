import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/PageLoader";

const Login = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (!loading && session) {
      navigate("/");
    }
  }, [session, loading, navigate]);

  if (loading || session) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join the Adventure</CardTitle>
          <CardDescription>
            Sign in or create an account to start your quest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme={theme === "dark" ? "dark" : "light"}
            providers={[]}
            redirectTo={`${window.location.origin}/`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;