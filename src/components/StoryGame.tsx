import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { showSuccess, showError } from '@/utils/toast';
import { storyData } from '@/data/storyData';
import { Choice } from '@/types/story';

const StoryGame = ({ onGameEnd }: { onGameEnd: () => void }) => {
    const { user } = useAuth();
    const [currentNodeKey, setCurrentNodeKey] = useState<string>('start');
    const [score, setScore] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);

    const saveScore = useCallback(async (finalScore: number) => {
        if (!user || finalScore === 0) return;

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
                showSuccess(`New high score saved: ${finalScore}!`);
            } else {
                showSuccess(`You finished with a score of ${finalScore}, but didn't beat your high score.`);
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
        const nextNodeKey = choice.nextSceneId;
        const nextNode = storyData[nextNodeKey];

        if (!nextNode) return;

        if (nextNodeKey === 'start') {
            restartGame();
            return;
        }
        
        setCurrentNodeKey(nextNodeKey);

        if (nextNode.score) {
            setScore(prev => prev + (nextNode.score || 0));
        }

        const isEndScene = nextNode.choices.some(c => c.nextSceneId === 'start') || nextNodeKey === 'endGame';
        if (isEndScene) {
            setGameEnded(true);
        }
    };

    const restartGame = useCallback(() => {
        setCurrentNodeKey('start');
        setScore(0);
        setGameEnded(false);
    }, []);

    const currentNode = storyData[currentNodeKey];

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Adventure Quest</CardTitle>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
                    {currentNode?.choices?.map((choice, index) => (
                        <Button
                            key={index}
                            onClick={() => handleChoice(choice)}
                            className="w-full"
                        >
                            {choice.text}
                        </Button>
                    ))}
                </div>
                {!gameEnded && (
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={restartGame}
                    >
                        Restart Game
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default StoryGame;