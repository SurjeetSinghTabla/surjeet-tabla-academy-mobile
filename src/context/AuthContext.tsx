import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  StudentProfile,
  getStudentProfile,
  subscribeToStudentProfile,
} from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: StudentProfile | null;
  unlockedTiers: string[];
  recommendedTier: 'beginner' | 'intermediate' | 'advanced';
  hasPaidRegistration: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string, fullName: string, phone: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  unlockedTiers: [],
  recommendedTier: 'beginner',
  hasPaidRegistration: false,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAndSetProfile = async (userId: string) => {
    const prof = await getStudentProfile(userId);
    if (prof) {
      setProfile(prof);
    }
  };

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchAndSetProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    // 2. Auth State Change Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchAndSetProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 3. Real-time Profile Listener when User is active
  useEffect(() => {
    if (!user) return;

    const channel = subscribeToStudentProfile(user.id, (updatedProfile) => {
      setProfile(updatedProfile);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const signIn = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: pass,
      });

      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        await fetchAndSetProfile(data.user.id);
      }
      return {};
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Login failed' };
    }
  };

  const signUp = async (email: string, pass: string, fullName: string, phone: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Create initial profile row
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: cleanEmail,
          full_name: fullName.trim(),
          phone: phone.trim(),
          has_paid_registration: true,
          unlocked_tiers: [],
          recommended_tier: 'beginner',
        });
        await fetchAndSetProfile(data.user.id);
      }
      return {};
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Registration failed' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchAndSetProfile(user.id);
    }
  };

  const unlockedTiers = profile?.unlocked_tiers || [];
  const recommendedTier = profile?.recommended_tier || 'beginner';
  const hasPaidRegistration = profile?.has_paid_registration ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        unlockedTiers,
        recommendedTier,
        hasPaidRegistration,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
