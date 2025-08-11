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
    const { user, profile, updateProfileGameState } = useAuth();

    const [storyData, setStoryData] = useState<Story | null>(null);
    const [storyLoading, setStoryLoading] = useState(true);

    const [currentNodeKey, setCurrentNodeKey] = useState<string>('start');
    const [score, setScore] = useState<number>(0);
    const [inventory, setInventory] = useState<string[]>([]);
    const [gameEnded, setGameEnded] = useState<boolean>(false);
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

    useEffect(() => {
        if (profile && storyData) {
            const sceneId = profile.current_scene_id || 'start';
            const currentScene = storyData[sceneId];
            const isEndScene = currentScene?.choices.some(c => c.nextSceneId === 'start') || sceneId === 'endGame';
            
            setCurrentNodeKey(sceneId);
            setScore(profile.current_score || 0);
            setInventory(profile.current_inventory || []);
            setGameEnded(isEndScene);
        }
    }, [profile, storyData]);

    useEffect(() => {
        if (!user) return;
        const fetchUserAchievements = async () => {
            const { data, error } = await supabase
                .from('user_achievements')
                .select('achievement_key')
                .eq('user_id', user.id);
            
            if (error) {
                console.error("Failed to fetch user achievements", error);
            } else if (data) {
                setUnlockedAchievements(data.map(a => a.achievement_key));
            }
        };
        fetchUserAchievements();
    }, [user]);

    const unlockAchievement = useCallback(async (key: string) => {
        if (!user || unlockedAchievements.includes(key)) return;
        setUnlockedAchievements(prev => [...prev, key]);
        const { data: achievement } = await supabase.from('achievements').select('name').eq('key', key).single();
        if (achievement) showSuccess(`Achievement Unlocked: ${achievement.name}`);
        await supabase.from('user_achievements').insert({ user_id: user.id, achievement_key: key });
    }, [user, unlockedAchievements]);

    useEffect(() => {
        const fetchStory = async () => {
            setStoryLoading(true);
            try {
                const { data: scenes, error } = await supabase
                    .from('scenes')
                    .select('*, choices(text, next_scene_id, requires)');

                if (error) throw error;

                const story: Story = scenes.reduce((acc, scene) => {
                    acc[scene.id] = {
                        ...scene,
                        choices: scene.choices.map((c: any) => ({
                            text: c.text,
                            nextSceneId: c.next_scene_id,
                            requires: c.requires,
                        })),
                    };
                    return acc;
                }, {} as Story);
                
                setStoryData(story);
            } catch (err: any) {
                showError(`Failed to load story: ${err.message}`);
            } finally {
                setStoryLoading(false);
            }
        };
        fetchStory();
    }, []);

    const saveHighScore = useCallback(async (finalScore: number, endingSceneId: string) => {
        if (!user) return;
        try {
            const { data: existingScore, error: selectError } = await supabase.from('game_scores').select('score').eq('user_id', user.id).single();
            if (selectError && selectError.code !== 'PGRST116') throw selectError;
            if (!existingScore || finalScore > existingScore.score) {
                const { error: upsertError } = await supabase.from('game_scores').upsert({ user_id: user.id, score: finalScore, ending_scene_id: endingSceneId }, { onConflict: 'user_id' });
                if (upsertError) throw upsertError;
                showSuccess(`New high score saved: ${finalScore}!`);
            } else if (finalScore > 0) {
                showSuccess(`You finished with a score of ${finalScore}, but didn't beat your high score.`);
            }
        } catch (err: any) {
            showError(err.message);
        }
    }, [user]);

    const restartGame = useCallback(async () => {
        const initialState = {
            current_scene_id: 'start',
            current_score: 0,
            current_inventory: [],
        };
        await updateProfileGameState(initialState);
        setCurrentNodeKey(initialState.current_scene_id);
        setScore(initialState.current_score);
        setInventory(initialState.current_inventory);
        setGameEnded(false);
    }, [updateProfileGameState]);

    const handleChoice = async (choice: Choice) => {
        if (!storyData || !user) return;
        const nextNodeKey = choice.nextSceneId;
        const nextNode = storyData[nextNodeKey];
        if (!nextNode) return;

        if (nextNodeKey === 'start') {
            await restartGame();
            return;
        }
        
        const newScore = score + (nextNode.score || 0);
        const newInventory = nextNode.gives ? [...new Set([...inventory, nextNode.gives])] : [...inventory];
        const isEndScene = nextNode.choices.some(c => c.nextSceneId === 'start') || nextNodeKey === 'endGame';

        setCurrentNodeKey(nextNodeKey);
        setScore(newScore);
        setInventory(newInventory);

        await updateProfileGameState({
            current_scene_id: nextNodeKey,
            current_score: newScore,
            current_inventory: newInventory,
        });

        if (isEndScene) {
            setGameEnded(true);
            saveHighScore(newScore, nextNodeKey);
        }

        // Data-driven achievement check
        if (nextNode.grants_achievement) {
            unlockAchievement(nextNode.grants_achievement);
        }

        // Special case achievement checks
        if (currentNodeKey === 'start') unlockAchievement('GAME_START');
        if (newScore >= 50 && score < 50) unlockAchievement('HIGH_SCORE_50');
    };

    if (storyLoading || (user && !profile)) {
        return (
            <Card className="w-full shadow-lg">
                <CardHeader><CardTitle className="text-center text-2xl font-bold">Adventure Quest</CardTitle></CardHeader>
                <CardContent className="min-h-[250px] p-6 space-y-4">
                    <Skeleton className="h-6 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter className="flex flex-col gap-4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
                        <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
                    </div>
                </CardFooter>
            </Card>
        );
    }

    const currentNode = storyData ? storyData[currentNodeKey] : null;
    const availableChoices = currentNode?.choices?.filter(choice => !choice.requires || inventory.includes(choice.requires));

    return (
        <Card className="w-full shadow-lg">
            <CardHeader><CardTitle className="text-center text-2xl font-bold">Adventure Quest</CardTitle></CardHeader>
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
                        <Button key={index} onClick={() => handleChoice(choice)} className="w-full h-full p-4 text-base whitespace-normal transition-transform hover:scale-105">
                            {choice.text}
                        </Button>
                    ))}
                </div>
                {!gameEnded && <Button variant="outline" className="mt-4 transition-transform hover:scale-105" onClick={restartGame}>Restart Game</Button>}
            </CardFooter>
        </Card>
    );
};

export default StoryGame;