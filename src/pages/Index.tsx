import { MadeWithDyad } from "@/components/made-with-dyad";
import StoryGame from "@/components/StoryGame";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Leaderboard from "@/components/Leaderboard";

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null; // Or a loading spinner
  }

  const handleGameEnd = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="absolute top-4 right-4">
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