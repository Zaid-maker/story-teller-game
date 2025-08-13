import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export interface Score {
    user_id: string;
    score: number;
    profiles: {
        username: string;
        avatar_url: string | null;
    };
    scenes: {
        text: string;
    } | null;
}

export interface UserRank {
    rank: number;
    score: number;
}

export const useLeaderboard = () => {
    const { user } = useAuth();
    const [scores, setScores] = useState<Score[]>([]);
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboardData = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('game_scores')
            .select('user_id, score, profiles!inner(username, avatar_url), scenes(text)')
            .order('score', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching scores:', error);
            setScores([]);
        } else if (data) {
            const validScores = data
                .map((s) => {
                    const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
                    const scene = Array.isArray(s.scenes) ? s.scenes[0] : s.scenes;
                    return {
                        user_id: s.user_id,
                        score: s.score,
                        profiles: profile || null,
                        scenes: scene || null,
                    };
                })
                .filter((s): s is Score => s.profiles !== null);
            setScores(validScores);
        }

        if (user) {
            const { data: rankData, error: rankError } = await supabase.rpc('get_user_rank', { p_user_id: user.id }).single();
            if (rankData && !rankError) {
                setUserRank(rankData as UserRank);
            } else {
                setUserRank(null);
            }
        }

        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchLeaderboardData();

        const channel = supabase
            .channel('realtime-leaderboard-scores')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'game_scores' },
                () => {
                    fetchLeaderboardData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchLeaderboardData]);

    return { scores, userRank, loading };
};