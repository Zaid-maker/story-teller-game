import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useStory } from './useStory';
import { useAchievements } from './useAchievements';
import { Choice } from '@/types/story';
import { showSuccess, showError } from '@/utils/toast';

export const useGame = () => {
    const { user, profile, updateProfileGameState } = useAuth();
    const { storyData, loading: storyLoading, error: storyError } = useStory();
    const { unlockedAchievements, unlockAchievement } = useAchievements(user?.id);

    const [currentNodeKey, setCurrentNodeKey] = useState<string>('start');
    const [score, setScore] = useState<number>(0);
    const [inventory, setInventory] = useState<string[]>([]);
    const [gameEnded, setGameEnded] = useState<boolean>(false);

    const loading = storyLoading || (!!user && !profile);

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

        await updateProfileGameState({
            current_scene_id: nextNodeKey,
            current_score: newScore,
            current_inventory: newInventory,
        });

        if (isEndScene) {
            saveHighScore(newScore, nextNodeKey);
        }

        if (nextNode.grants_achievement) {
            unlockAchievement(nextNode.grants_achievement);
        }

        if (currentNodeKey === 'start') unlockAchievement('GAME_START');
        if (newScore >= 50 && score < 50) unlockAchievement('HIGH_SCORE_50');
    };

    const currentNode = storyData ? storyData[currentNodeKey] : null;
    
    const availableChoices = currentNode?.choices?.map(choice => {
        const canAfford = !choice.score_required || score >= choice.score_required;
        const hasItem = !choice.requires || inventory.includes(choice.requires);
        const disabled = !canAfford || !hasItem;
        
        let disabledReason = '';
        if (!canAfford) {
            disabledReason = `You need ${choice.score_required} score to do this.`;
        } else if (!hasItem) {
            disabledReason = `You need the '${choice.requires}' item.`;
        }

        return { ...choice, disabled, disabledReason };
    });

    return {
        loading,
        storyError,
        currentNode,
        score,
        inventory,
        gameEnded,
        availableChoices,
        handleChoice,
        restartGame,
    };
};