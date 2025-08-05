import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Choice {
    text: string;
    target: string;
    scoreChange?: number;
}

interface StoryNode {
    text: string;
    choices?: Choice[];
    end?: boolean;
}

interface StoryData {
    title: string;
    startNode: string;
    nodes: Record<string, StoryNode>;
}

const StoryGame = ({ onGameEnd }: { onGameEnd: () => void }) => {
    const { user } = useAuth();
    const [storyData, setStoryData] = useState<StoryData | null>(null);
    const [currentNodeKey, setCurrentNodeKey] = useState<string>('start');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);

    const fetchStory = useCallback(async () => {
        setError(null);
        try {
            const response = await fetch('/story.json');
            if (!response.ok) {
                throw new Error('Failed to load story data.');
            }
            const data: StoryData = await response.json();
            setStoryData(data);
            setCurrentNodeKey(data.startNode);
        } catch (err: any) {
            setError(err.message);
            showError('Could not load the adventure. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStory();
    }, [fetchStory]);

    const saveScore = useCallback(async (finalScore: number) => {
        if (!user) return;

        try {
            const { data: existingScore, error: selectError } = await supabase
                .from('game_scores')
                .select('score')
                .eq('user_id', user.id)
                .single();

            if (selectError && selectError.code !== 'PGRST116') {
                throw selectError;
            }

            if (!existingScore || finalScore > existingScore.score) {
                const { error: upsertError } = await supabase
                    .from('game_scores')
                    .upsert({ user_id: user.id, score: finalScore }, { onConflict: 'user_id' });

                if (upsertError) throw upsertError;
                showSuccess('New high score saved!');
            } else {
                showSuccess('You finished, but did not beat your high score.');
            }

            onGameEnd();
        } catch (err: any) {
            showError(err.message);
        }
    }, [user, onGameEnd]);

    useEffect(() => {
        if (gameEnded) {
            saveScore(score);
        }
    }, [gameEnded, score, saveScore]);

    const handleChoice = (choice: Choice) => {
        setScore(prev => prev + (choice.scoreChange || 0));
        const nextNode = storyData?.nodes[choice.target];
        if (nextNode?.end) {
            setGameEnded(true);
        }
        setCurrentNodeKey(choice.target);
    };

    const restartGame = useCallback(() => {
        if (!storyData) return;
        setCurrentNodeKey(storyData.startNode);
        setScore(0);
        setGameEnded(false);
    }, [storyData]);

    const currentNode = storyData?.nodes[currentNodeKey];

    if (loading) {
        return <Card className="w-full min-h-[400px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></Card>;
    }

    if (error) {
        return (
            <Card className="w-full min-h-[400px] flex flex-col items-center justify-center text-center p-4">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-destructive mb-4">
                    Oops! We couldn't load the adventure.
                </p>
                <Button onClick={() => { setLoading(true); fetchStory(); }}>
                    Try Again
                </Button>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">{storyData?.title}</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] p-6 text-lg">
                <p className="whitespace-pre-wrap">{currentNode?.text}</p>
                {gameEnded && (
                    <div className="mt-4 text-center">
                        <p className="text-2xl font-semibold">Game Over!</p>
                        <p className="text-xl">Your final score is: {score}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6">
                {gameEnded ? (
                    <Button className="w-full max-w-xs" onClick={restartGame}>Play Again</Button>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
                            {currentNode?.choices?.map((choice: any) => (
                                <Button
                                    key={choice.target}
                                    onClick={() => handleChoice(choice)}
                                    className="w-full"
                                >
                                    {choice.text}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={restartGame}
                        >
                            Restart Game
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
};

export default StoryGame;