import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess } from '@/utils/toast';

export const useAchievements = (userId: string | undefined) => {
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

    useEffect(() => {
        if (!userId) return;
        const fetchUserAchievements = async () => {
            const { data, error } = await supabase
                .from('user_achievements')
                .select('achievement_key')
                .eq('user_id', userId);
            
            if (error) {
                console.error("Failed to fetch user achievements", error);
            } else if (data) {
                setUnlockedAchievements(data.map(a => a.achievement_key));
            }
        };
        fetchUserAchievements();
    }, [userId]);

    const unlockAchievement = useCallback(async (key: string) => {
        if (!userId || unlockedAchievements.includes(key)) return;
        
        setUnlockedAchievements(prev => [...prev, key]);
        
        const { data: achievement } = await supabase.from('achievements').select('name').eq('key', key).single();
        if (achievement) {
            showSuccess(`Achievement Unlocked: ${achievement.name}`);
        }
        
        await supabase.from('user_achievements').insert({ user_id: userId, achievement_key: key });
    }, [userId, unlockedAchievements]);

    return { unlockedAchievements, unlockAchievement };
};