import React, { useState } from "react";
import { storyData } from "@/data/storyData";
import SceneDisplay from "./SceneDisplay";
import { Button } from "@/components/ui/button";

const StoryGame: React.FC = () => {
  const [currentSceneId, setCurrentSceneId] = useState<string>("start");

  const handleChoice = (nextSceneId: string) => {
    setCurrentSceneId(nextSceneId);
  };

  const restartGame = () => {
    setCurrentSceneId("start");
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <SceneDisplay scene={currentScene} onChoice={handleChoice} />
      {currentSceneId !== "start" && (
        <Button
          variant="outline"
          className="mt-8 px-6 py-3 text-lg"
          onClick={restartGame}
        >
          Restart Game
        </Button>
      )}
    </div>
  );
};

export default StoryGame;