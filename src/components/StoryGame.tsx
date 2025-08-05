import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { showSuccess, showError } from '@/utils/toast';
import { storyData } from '@/data/storyData';
import { Choice } from '@/types/story';
import { Inventory } from './Inventory';

const StoryGame = ({ onGameEnd }: { onGameEnd: () => void }) => {
    const { user } = useAuth();

    const [currentNodeKey, setCurrentNodeKey] = useState<string>(() => localStorage.getItem('adventureGame_node') || 'start');
    const [score, setScore] = useState<number>(() => parseInt(localStorage.getItem('adventureGame_score') || '0', 10));
    const [inventory, setInventory] = useState<string[]>(() => JSON.parse(localStorage.getItem('adventureGame_inventory') || '[]'));
    const [gameEnded, setGameEnded] = useState<boolean>(() => localStorage.getItem('adventureGame_ended') === 'true');

    useEffect(() => {
        localStorage.setItem('adventureGame_node', currentNodeKey);
    }, [currentNodeKey]);

    useEffect(() => {
        localStorage.setItem('adventureGame_score', score.toString());
    }, [score]);

    useEffect(() => {
        localStorage.setItem('adventureGame_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('adventureGame_ended', gameEnded.toString());
    }, [gameEnded]);

    const clearSavedGameState = useCallback(() => {
        localStorage.removeItem('adventureGame_node');
        localStorage.removeItem('adventureGame_score');
        localStorage.removeItem('adventureGame_inventory');
        localStorage.removeItem('adventureGame_ended');
    }, []);

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
            const hasBeenSaved = localStorage.getItem('adventureGame_score_saved') === score.toString();
            if (!hasBeenSaved) {
                saveScore(score);
                localStorage.setItem('adventureGame_score_saved', score.toString());
            }
        }
    }, [gameEnded, score, saveScore]);

    const restartGame = useCallback(() => {
        clearSavedGameState();
        localStorage.removeItem('adventureGame_score_saved');
        setCurrentNodeKey('start');
        setScore(0);
        setInventory([]);
        setGameEnded(false);
    }, [clearSavedGameState]);

    const handleChoice = (choice: Choice) => {
        const nextNodeKey = choice.nextSceneId;
        const nextNode = storyData[nextNodeKey];

        if (!nextNode) return;

        if (nextNodeKey === 'start') {
            restartGame();
            return;
        }
        
        setCurrentNodeKey(nextNodeKey);

        if (nextNode.gives) {
            setInventory(prev => [...new Set([...prev, nextNode.gives!])]);
        }

        if (nextNode.score) {
            setScore(prev => prev + (nextNode.score || 0));
        }

        const isEndScene = nextNode.choices.some(c => c.nextSceneId === 'start') || nextNodeKey === 'endGame';
        if (isEndScene) {
            setGameEnded(true);
        }
    };

    const currentNode = storyData[currentNodeKey];
    const availableChoices = currentNode?.choices?.filter(choice => {
        return !choice.requires || inventory.includes(choice.requires);
    });

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Adventure Quest</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[250px] p-6 text-lg">
                <p className="whitespace-pre-wrap">{currentNode?.text}</p>
                
                {!gameEnded && <Inventory items={inventory} />}

                {gameEnded && (
                    <div className="mt-4 text-center">
                        <p className="text-2xl font-semibold">Game Over!</p>
                        <p className="text-xl">Your final score is: {score}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
                    {availableChoices?.map((choice, index) => (
                        <Button
                            key={index}
                            onClick={() => handleChoice(choice)}
                            className="w-full h-full p-4 text-base whitespace-normal transition-transform hover:scale-105"
                        >
                            {choice.text}
                        </Button>
                    ))}
                </div>
                {!gameEnded && (
                    <Button
                        variant="outline"
                        className="mt-4 transition-transform hover:scale-105"
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