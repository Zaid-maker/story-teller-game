import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface Score {
    score: number;
    profiles: {
        username: string;
    } | null;
}

const Leaderboard = ({ refreshKey }: { refreshKey: number }) => {
    const [scores, setScores] = useState<Score[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchScores = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('game_scores')
            .select('score, profiles(username)')
            .order('score', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching scores:', error);
        } else if (data) {
            setScores(data as any);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchScores();
    }, [fetchScores, refreshKey]);

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
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
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
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{score.profiles?.username || 'Anonymous'}</TableCell>
                                    <TableCell className="text-right">{score.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default Leaderboard;