import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { showSuccess, showError } from '@/utils/toast';
import { Choice, Story } from '@/types/story';
import { Inventory } from './Inventory';
import { Skeleton } from './ui/skeleton';

const StoryGame = () => {
    const { user } = useAuth();

    const [storyData, setStoryData] = useState<Story | null>(null);
    const [storyLoading, setStoryLoading] = useState(true);

    const [currentNodeKey, setCurrentNodeKey] = useState<string>(() => localStorage.getItem('adventureGame_node') || 'start');
    const [score, setScore] = useState<number>(() => parseInt(localStorage.getItem('adventureGame_score') || '0', 10));
    const [inventory, setInventory] = useState<string[]>(() => JSON.parse(localStorage.getItem('adventureGame_inventory') || '[]'));
    const [gameEnded, setGameEnded] = useState<boolean>(() => localStorage.getItem('adventureGame_ended') === 'true');

    useEffect(() => {
        const fetchStory = async () => {
            setStoryLoading(true);
            try {
                const { data: scenesData, error: scenesError } = await supabase
                    .from('scenes')
                    .select('*');

                if (scenesError) throw scenesError;

                const { data: choicesData, error: choicesError } = await supabase
                    .from('choices')
                    .select('*');

                if (choicesError) throw choicesError;

                const reconstructedStory: Story = {};
                for (const scene of scenesData) {
                    reconstructedStory[scene.id] = {
                        ...scene,
                        choices: choicesData
                            .filter(c => c.scene_id === scene.id)
                            .map(c => ({
                                text: c.text,
                                nextSceneId: c.next_scene_id,
                                requires: c.requires,
                            })),
                    };
                }
                setStoryData(reconstructedStory);
            } catch (err: any) {
                showError(`Failed to load story: ${err.message}`);
            } finally {
                setStoryLoading(false);
            }
        };

        fetchStory();
    }, []);

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
                showSuccess(`New high score saved: ${finalScore}!`);
            } else if (finalScore > 0) {
                showSuccess(`You finished with a score of ${finalScore}, but didn't beat your high score.`);
            }
        } catch (err: any) {
            showError(err.message);
        }
    }, [user]);

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
        if (!storyData) return;

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

    if (storyLoading) {
        return (
            <Card className="w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Adventure Quest</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[250px] p-6 space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter className="flex flex-col gap-4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardFooter>
            </Card>
        );
    }

    const currentNode = storyData ? storyData[currentNodeKey] : null;
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