import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://qvqzlzbboczgbzqkubiw.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_kUch54gAOMXmJzl3S3omVw_x87Rb4lj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface StudentProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  recommended_tier: 'beginner' | 'intermediate' | 'advanced' | null;
  has_paid_registration: boolean;
  unlocked_tiers: string[];
  created_at: string;
  updated_at?: string;
}

/**
 * Fetch profile for logged-in student.
 */
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('[Supabase] Profile fetch error:', error.message);
      return null;
    }
    return data as StudentProfile;
  } catch (err) {
    console.warn('[Supabase] Network error fetching profile:', err);
    return null;
  }
}

/**
 * Real-time subscription to profile updates (e.g. course unlocked on web or by Surjeet).
 */
export function subscribeToStudentProfile(
  userId: string,
  onUpdate: (profile: StudentProfile) => void
) {
  return supabase
    .channel(`public:profiles:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        if (payload.new) {
          onUpdate(payload.new as StudentProfile);
        }
      }
    )
    .subscribe();
}
