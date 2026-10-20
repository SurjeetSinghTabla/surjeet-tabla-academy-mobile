import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Mail,
  Phone,
  Award,
  Unlock,
  Lock,
  LogOut,
  Sparkles,
  CreditCard,
  LogIn,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors, Fonts } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';

export default function ProfileScreen() {
  const { user, profile, unlockedTiers, recommendedTier, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of the Gurukul portal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  const tierLabels = {
    beginner: 'Tier I: Foundations',
    intermediate: 'Tier II: Craft & Sangat',
    advanced: 'Tier III: Master Artistry',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>DISCIPLE PORTAL</Text>
            <View style={styles.badgeDot} />
          </View>
          <Text style={styles.title}>Account & Curriculum</Text>
        </View>

        {user ? (
          <>
            {/* User Info Card */}
            <GlassCard variant="dark" intensity={70} style={styles.userCard}>
              <View style={styles.userHeaderRow}>
                <View style={styles.avatarCircle}>
                  <User size={26} color={Colors.gold} />
                </View>
                <View style={styles.userMeta}>
                  <Text style={styles.userName}>
                    {profile?.full_name || user.email?.split('@')[0] || 'Disciple'}
                  </Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  {profile?.phone && (
                    <Text style={styles.userPhone}>{profile.phone}</Text>
                  )}
                </View>
              </View>

              <View style={styles.guruRecBadge}>
                <Sparkles size={12} color={Colors.gold} />
                <Text style={styles.guruRecText}>
                  Guru Assigned Tier: {tierLabels[recommendedTier] || 'Tier I: Foundations'}
                </Text>
              </View>
            </GlassCard>

            {/* Unlocked Curriculum Tiers */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Curriculum Enrollment</Text>
            </View>

            <View style={styles.tiersList}>
              {(['beginner', 'intermediate', 'advanced'] as const).map((tierKey) => {
                const isUnlocked = unlockedTiers.includes(tierKey);

                return (
                  <GlassCard
                    key={tierKey}
                    variant={isUnlocked ? 'goldAccent' : 'dark'}
                    intensity={65}
                    style={styles.tierEnrollmentCard}
                  >
                    <View style={styles.tierRow}>
                      <View style={styles.tierRowLeft}>
                        {isUnlocked ? (
                          <Unlock size={18} color={Colors.gold} />
                        ) : (
                          <Lock size={18} color="rgba(245, 239, 230, 0.4)" />
                        )}
                        <View>
                          <Text style={styles.tierCardTitle}>{tierLabels[tierKey]}</Text>
                          <Text style={styles.tierCardStatus}>
                            {isUnlocked ? 'Lifetime Access Active' : 'Locked • Tuition required'}
                          </Text>
                        </View>
                      </View>

                      {isUnlocked ? (
                        <View style={styles.activePill}>
                          <Text style={styles.activePillText}>Active</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              'Enroll in Curriculum',
                              `Unlock ${tierLabels[tierKey]} with your ₹400 screening fee credit applied.`,
                              [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Proceed to Payment', onPress: () => router.push('/(tabs)') },
                              ]
                            );
                          }}
                          style={styles.unlockPill}
                        >
                          <Text style={styles.unlockPillText}>Unlock</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </GlassCard>
                );
              })}
            </View>

            {/* Sign Out Button */}
            <GlassButton
              title="Sign Out of Portal"
              onPress={handleSignOut}
              variant="danger"
              size="md"
              icon={<LogOut size={16} color="#EF4444" />}
              style={styles.signOutButton}
            />
          </>
        ) : (
          /* Guest Unauthenticated State */
          <GlassCard variant="dark" intensity={70} style={styles.guestCard}>
            <View style={styles.guestIconCircle}>
              <User size={32} color={Colors.gold} />
            </View>
            <Text style={styles.guestTitle}>Disciple Authentication Required</Text>
            <Text style={styles.guestDesc}>
              Sign in with your approved Gurukul email to access unlocked video streams, personal riyaz records, and 1-on-1 bookings.
            </Text>

            <GlassButton
              title="Sign In to Portal"
              onPress={() => router.push('/(auth)/login')}
              variant="gold"
              size="lg"
              icon={<LogIn size={16} color={Colors.obsidian} />}
              style={{ width: '100%', marginBottom: 12 }}
            />

            <GlassButton
              title="Apply for Admission"
              onPress={() => router.push('/(auth)/register-screening')}
              variant="glass"
              size="md"
              style={{ width: '100%' }}
            />
          </GlassCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.obsidian,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  title: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 28,
    color: Colors.ivory,
  },
  userCard: {
    marginBottom: 20,
  },
  userHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 20,
    color: Colors.ivory,
  },
  userEmail: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.65)',
    marginTop: 1,
  },
  userPhone: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
    marginTop: 2,
  },
  guruRecBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(197, 160, 89, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
  },
  guruRecText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 20,
    color: Colors.ivory,
  },
  tiersList: {
    gap: 10,
    marginBottom: 24,
  },
  tierEnrollmentCard: {
    padding: 14,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  tierCardTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 14,
    color: Colors.ivory,
  },
  tierCardStatus: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.55)',
    marginTop: 2,
  },
  activePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  activePillText: {
    fontFamily: Fonts.monoBold,
    fontSize: 10,
    color: Colors.emerald,
    textTransform: 'uppercase',
  },
  unlockPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.gold,
  },
  unlockPillText: {
    fontFamily: Fonts.monoBold,
    fontSize: 11,
    color: Colors.obsidian,
    textTransform: 'uppercase',
  },
  signOutButton: {
    marginTop: 8,
  },
  guestCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  guestIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  guestTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 22,
    color: Colors.ivory,
    textAlign: 'center',
    marginBottom: 8,
  },
  guestDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
    color: 'rgba(245, 239, 230, 0.65)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    maxWidth: 300,
  },
});
