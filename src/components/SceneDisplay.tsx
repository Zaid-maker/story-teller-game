import React from "react";
import { Scene } from "@/types/story";
import ChoiceButton from "./ChoiceButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SceneDisplayProps {
  scene: Scene;
  onChoice: (nextSceneId: string) => void;
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({ scene, onChoice }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Interactive Story</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          {scene.text}
        </p>
        <div className="flex flex-col md:flex-row md:justify-center gap-4">
          {scene.choices.map((choice, index) => (
            <ChoiceButton
              key={index}
              text={choice.text}
              onClick={() => onChoice(choice.nextSceneId)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SceneDisplay;