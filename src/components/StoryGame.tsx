import React, { useState } from "react";
import { storyData } from "@/data/storyData";
import SceneDisplay from "./SceneDisplay";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

interface StoryGameProps {
  onGameEnd: () => void;
}

const StoryGame: React.FC<StoryGameProps> = ({ onGameEnd }) => {
  const [sceneHistory, setSceneHistory] = useState<string[]>(["start"]);
  const { user } = useAuth();

  const currentSceneId = sceneHistory[sceneHistory.length - 1];

  const updateScore = async (score: number) => {
    if (!user) return;

    const { data: existingScoreData } = await supabase
      .from('game_scores')
      .select('score')
      .eq('user_id', user.id)
      .single();

    const existingScore = existingScoreData?.score || 0;

    if (score > existingScore) {
      const { error } = await supabase
        .from('game_scores')
        .upsert({ user_id: user.id, score }, { onConflict: 'user_id' });

      if (error) {
        showError(error.message);
      } else {
        showSuccess(`New high score: ${score}!`);
        onGameEnd();
      }
    }
  };

  const handleChoice = async (nextSceneId: string) => {
    const nextScene = storyData[nextSceneId];
    if (nextScene?.score) {
      await updateScore(nextScene.score);
    }
    setSceneHistory((prevHistory) => [...prevHistory, nextSceneId]);
  };

  const handleGoBack = () => {
    setSceneHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

  const restartGame = () => {
    setSceneHistory(["start"]);
  };

  const currentScene = storyData[currentSceneId];

  if (!currentScene) {
    return (
      <div className="text-center p-8">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Error: Scene Not Found!</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          The story tried to go to a scene that doesn't exist: "{currentSceneId}".
        </p>
        <Button onClick={restartGame}>Restart Game</Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SceneDisplay scene={currentScene} onChoice={handleChoice} />
      <div className="flex gap-4 mt-8">
        {sceneHistory.length > 1 && (
          <Button
            variant="outline"
            className="px-6 py-3 text-lg"
            onClick={handleGoBack}
          >
            Go Back
          </Button>
        )}
        <Button
          variant="outline"
          className="px-6 py-3 text-lg"
          onClick={restartGame}
        >
          Restart Game
        </Button>
      </div>
      {currentSceneId === "start" && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          You are at the beginning of your adventure.
        </p>
      )}
    </div>
  );
};

export default StoryGame;