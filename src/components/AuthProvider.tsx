import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

export interface GameState {
  current_scene_id: string;
  current_score: number;
  current_inventory: string[];
}

interface Profile extends GameState {
  username: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refetchProfile: () => void;
  updateProfileGameState: (newState: Partial<GameState>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userToFetch: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url, current_scene_id, current_score, current_inventory')
      .eq('id', userToFetch.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const refetchProfile = useCallback(() => {
    if (user) {
      fetchProfile(user);
    }
  }, [user, fetchProfile]);

  const updateProfileGameState = async (newState: Partial<GameState>) => {
    if (!user) return;
    const { error } = await supabase
        .from('profiles')
        .update(newState)
        .eq('id', user.id);
    if (error) {
        showError("Failed to save game progress.");
        console.error(error);
    }
    // Also update local state to avoid a full refetch
    setProfile(prev => prev ? { ...prev, ...newState } as Profile : null);
  };

  const value = { session, user, profile, loading, refetchProfile, updateProfileGameState };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};