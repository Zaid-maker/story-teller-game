import { Gem, Flower, Flower2, Sparkles } from "lucide-react";

interface InventoryProps {
  items: string[];
}

const itemDetails: { [key: string]: { name: string; icon: React.ReactNode } } = {
  orb: { name: "Glowing Orb", icon: <Gem className="h-5 w-5 text-blue-400 mr-2" /> },
  enchanted_flowers: { name: "Enchanted Flowers", icon: <Flower2 className="h-5 w-5 text-pink-400 mr-2" /> },
  flowers: { name: "Moonpetal Flowers", icon: <Flower className="h-5 w-5 text-purple-400 mr-2" /> },
  glowing_flower: { name: "Shrine Flower", icon: <Sparkles className="h-5 w-5 text-yellow-400 mr-2" /> },
};

export const Inventory = ({ items }: InventoryProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-semibold text-muted-foreground mb-2">Your Inventory:</h4>
      <ul className="space-y-2">
        {items.map((itemKey) => {
          const item = itemDetails[itemKey];
          if (!item) return null;
          return (
            <li key={itemKey} className="flex items-center text-sm">
              {item.icon}
              <span>{item.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};