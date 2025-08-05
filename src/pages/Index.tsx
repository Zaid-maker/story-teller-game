import { MadeWithDyad } from "@/components/made-with-dyad";
import StoryGame from "@/components/StoryGame";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "@/components/Leaderboard";
import { Header } from "@/components/Header";
import { PageLoader } from "@/components/PageLoader";

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
    return <PageLoader />;
  }

  if (!session) {
    return null;
  }

  const handleGameEnd = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <StoryGame onGameEnd={handleGameEnd} />
          </div>
          <div>
            <Leaderboard refreshKey={refreshKey} />
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;