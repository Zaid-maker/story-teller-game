import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useAuth } from "@/components/AuthProvider";
import { Swords } from "lucide-react";
import { useEffect } from "react";
import { PageLoader } from "@/components/PageLoader";

const Landing = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) {
      navigate("/game");
    }
  }, [session, loading, navigate]);

  if (loading || session) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <Swords className="h-24 w-24 text-primary mb-6" />
        <h1 className="text-5xl font-bold mb-4">Welcome to Adventure Quest</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          An interactive text-based adventure where your choices shape your destiny. Embark on a journey, earn points, and see how you rank on the leaderboard.
        </p>
        <Button asChild size="lg" className="transition-transform hover:scale-105">
          <Link to="/login">Get Started</Link>
        </Button>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Landing;