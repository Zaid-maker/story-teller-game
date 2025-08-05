import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useAuth } from "@/components/AuthProvider";
import { Swords, BookOpenText, Trophy, UserCircle, LogIn, Gamepad2, Crown } from "lucide-react";
import { useEffect } from "react";
import { PageLoader } from "@/components/PageLoader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center p-4 py-16 md:py-24">
          <Swords className="h-24 w-24 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Adventure Quest</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            An interactive text-based adventure where your choices shape your destiny. Embark on a journey, earn points, and see how you rank on the leaderboard.
          </p>
          <Button asChild size="lg" className="transition-transform hover:scale-105">
            <Link to="/login">Get Started</Link>
          </Button>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Game Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <BookOpenText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Interactive Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Navigate a branching narrative where your decisions determine the outcome and your final score.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Live Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Compete with other players and see your high score on the real-time leaderboard.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <UserCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Custom Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Personalize your profile with a unique username and avatar that represents you.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Play Section */}
        <section id="how-to-play" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="mb-4 bg-primary/10 p-4 rounded-full">
                  <LogIn className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Create an Account</h3>
                <p className="text-muted-foreground">Sign up for free to save your progress and scores.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 bg-primary/10 p-4 rounded-full">
                  <Gamepad2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Start Your Adventure</h3>
                <p className="text-muted-foreground">Make choices that guide your story and earn you points.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 bg-primary/10 p-4 rounded-full">
                  <Crown className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Climb the Leaderboard</h3>
                <p className="text-muted-foreground">Achieve a high score and see your name in lights!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-secondary">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Quest?</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join now and write your own legend. Your adventure awaits!</p>
                <Button asChild size="lg" className="transition-transform hover:scale-105">
                    <Link to="/login">Begin Your Journey</Link>
                </Button>
            </div>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Landing;