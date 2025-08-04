import React from "react";
import { Button } from "@/components/ui/button";

interface ChoiceButtonProps {
  text: string;
  onClick: () => void;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ text, onClick }) => {
  return (
    <Button
      className="w-full md:w-auto px-6 py-3 text-lg"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default ChoiceButton;