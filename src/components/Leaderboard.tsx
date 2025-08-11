import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, User, Info } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Score {
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

interface UserRank {
    rank: number;
    score: number;
}

const Leaderboard = () => {
    const { user } = useAuth();
    const [scores, setScores] = useState<Score[]>([]);
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchScores = useCallback(async () => {
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
            }
        }

        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchScores();

        const channel = supabase
            .channel('realtime-scores')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'game_scores' },
                () => {
                    fetchScores();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchScores]);

    const isUserInTop10 = user && scores.some(score => score.user_id === user.id);

    return (
        <Card className="w-full max-w-md mt-8">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                    <Crown className="text-yellow-500" /> Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Rank</TableHead>
                                <TableHead>Player</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scores.map((score, index) => (
                                <TableRow key={score.user_id} data-current-user={user?.id === score.user_id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <Link to={`/profile/${score.user_id}`} className="flex items-center gap-3 hover:underline">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={score.profiles.avatar_url ?? undefined} alt={score.profiles.username || 'player avatar'} />
                                                <AvatarFallback>
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            {score.profiles.username || 'Anonymous'}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span>{score.score}</span>
                                            {score.scenes?.text && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs text-sm">
                                                            <strong>Ending:</strong> {score.scenes.text}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {user && userRank && !isUserInTop10 && (
                                <>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground py-2">...</TableCell>
                                    </TableRow>
                                    <TableRow data-current-user="true">
                                        <TableCell className="font-medium">{userRank.rank}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3 font-semibold">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.user_metadata.avatar_url ?? undefined} alt="Your avatar" />
                                                    <AvatarFallback>
                                                        <User className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                You
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">{userRank.score}</TableCell>
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default Leaderboard;