import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { PageLoader } from '@/components/PageLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AchievementsList } from '@/components/AchievementsList';
import { User, Crown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileData {
  username: string | null;
  avatar_url: string | null;
}

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Fetch profile details
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .single();

      if (profileError || !profileData) {
        setError("Could not load user profile.");
        setLoading(false);
        return;
      }
      setProfile(profileData);

      // Fetch high score
      const { data: scoreData, error: scoreError } = await supabase
        .from('game_scores')
        .select('score')
        .eq('user_id', userId)
        .single();
      
      if (scoreData && !scoreError) {
        setScore(scoreData.score);
      }

      setLoading(false);
    };

    fetchProfileData();
  }, [userId]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Game
          </Link>
        </Button>
        {error ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : profile && userId ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatar_url ?? undefined} alt="User avatar" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl">{profile.username || 'Adventurer'}</CardTitle>
              {score !== null && (
                <div className="flex items-center gap-2 text-xl text-muted-foreground">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span>High Score: {score}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Achievements</h3>
                <AchievementsList userId={userId} />
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
};

export default ProfilePage;