import { MadeWithDyad } from "@/components/made-with-dyad";
import StoryGame from "@/components/StoryGame";
import Leaderboard from "@/components/Leaderboard";
import { Header } from "@/components/Header";

export const AuthenticatedApp = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <StoryGame />
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};