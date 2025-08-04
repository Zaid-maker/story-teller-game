import { MadeWithDyad } from "@/components/made-with-dyad";
import StoryGame from "@/components/StoryGame";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Leaderboard from "@/components/Leaderboard";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && !session) {
      navigate("/login");
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleGameEnd = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <ThemeToggle />
        <Link to="/account">
          <Button variant="outline">Account</Button>
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <StoryGame onGameEnd={handleGameEnd} />
        <Leaderboard refreshKey={refreshKey} />
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;