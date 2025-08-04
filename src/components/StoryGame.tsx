import React, { useState } from "react";
import { storyData } from "@/data/storyData";
import SceneDisplay from "./SceneDisplay";
import { Button } from "@/components/ui/button";

const StoryGame: React.FC = () => {
  const [sceneHistory, setSceneHistory] = useState<string[]>(["start"]);

  const currentSceneId = sceneHistory[sceneHistory.length - 1];

  const handleChoice = (nextSceneId: string) => {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
        {currentSceneId !== "start" && (
          <Button
            variant="outline"
            className="px-6 py-3 text-lg"
            onClick={restartGame}
          >
            Restart Game
          </Button>
        )}
      </div>
    </div>
  );
};

export default StoryGame;