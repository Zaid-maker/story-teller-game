import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Icon } from '@/components/Icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

interface Item {
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
}

interface InventoryProps {
  items: string[];
}

export const Inventory = ({ items }: InventoryProps) => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('items').select('*');
      if (error) {
        console.error("Error fetching items:", error);
      } else if (data) {
        setAllItems(data);
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  if (items.length === 0) {
    return null;
  }

  const inventoryItems = items
    .map(key => allItems.find(item => item.key === key))
    .filter((item): item is Item => !!item);

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-semibold text-muted-foreground mb-2">Your Inventory:</h4>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/2" />
        </div>
      ) : (
        <ul className="space-y-2">
          {inventoryItems.map((item) => (
            <li key={item.key} className="flex items-center text-sm">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center cursor-help">
                    <Icon name={item.icon} className="h-5 w-5 text-primary mr-2" />
                    <span>{item.name}</span>
                  </div>
                </TooltipTrigger>
                {item.description && (
                  <TooltipContent>
                    <p>{item.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};