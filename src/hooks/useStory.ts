import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/types/story';
import { showError } from '@/utils/toast';

export const useStory = () => {
    const [storyData, setStoryData] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStory = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: scenes, error: fetchError } = await supabase
                    .from('scenes')
                    .select('*, choices(text, next_scene_id, requires, score_required)');

                if (fetchError) throw fetchError;

                const story: Story = scenes.reduce((acc, scene) => {
                    acc[scene.id] = {
                        ...scene,
                        choices: scene.choices.map((c: any) => ({
                            text: c.text,
                            nextSceneId: c.next_scene_id,
                            requires: c.requires,
                            score_required: c.score_required,
                        })),
                    };
                    return acc;
                }, {} as Story);
                
                setStoryData(story);
            } catch (err: any) {
                const errorMessage = `Failed to load story: ${err.message}`;
                showError(errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, []);

    return { storyData, loading, error };
};