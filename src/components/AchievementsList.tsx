import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@/components/Icon';

type Achievement = {
  achieved_at: string;
  achievements: {
    name: string;
    description: string;
    icon: string | null;
  };
};

export const AchievementsList = ({ userId }: { userId: string }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!userId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achieved_at, achievements!inner(name, description, icon)')
        .eq('user_id', userId)
        .order('achieved_at', { ascending: false });

      if (error) {
        console.error("Error fetching achievements:", error);
      } else if (data) {
        setAchievements(data as any);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4 border rounded-lg">
        <p>No achievements unlocked yet. Keep playing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {achievements.map((ach, index) => (
        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
          <div className="p-2 bg-yellow-400/20 rounded-full mt-1">
            <Icon name={ach.achievements.icon ?? 'Trophy'} className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h4 className="font-semibold">{ach.achievements.name}</h4>
            <p className="text-sm text-muted-foreground">{ach.achievements.description}</p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Unlocked on {new Date(ach.achieved_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};