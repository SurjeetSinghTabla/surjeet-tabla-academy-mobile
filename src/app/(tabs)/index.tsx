import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  Lock,
  Unlock,
  Play,
  BookOpen,
  ChevronRight,
  CreditCard,
  GraduationCap,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors, Fonts } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import {
  CourseLesson,
  SiteSettings,
  FALLBACK_SITE_SETTINGS,
  getCourseLessons,
  getSiteSettings,
} from '@/lib/sanity';

export default function GurukulHomeScreen() {
  const { user, profile, unlockedTiers, recommendedTier } = useAuth();

  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTierKey, setSelectedTierKey] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const loadData = async () => {
    try {
      const [fetchedLessons, fetchedSettings] = await Promise.all([
        getCourseLessons(),
        getSiteSettings(),
      ]);
      setLessons(fetchedLessons);
      setSettings(fetchedSettings);
    } catch (err) {
      console.warn('Load data error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Set default selected tier to recommended tier if student has one
  useEffect(() => {
    if (recommendedTier) {
      setSelectedTierKey(recommendedTier);
    }
  }, [recommendedTier]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getTierLessons = (tier: string) => {
    return lessons.filter((l) => (l.tier || '').toLowerCase().includes(tier.toLowerCase()));
  };

  const tierPrices: Record<'beginner' | 'intermediate' | 'advanced', number> = {
    beginner: settings.beginnerPriceInr || 2500,
    intermediate: settings.intermediatePriceInr || 3000,
    advanced: settings.advancedPriceInr || 3500,
  };

  const tierNames: Record<'beginner' | 'intermediate' | 'advanced', string> = {
    beginner: 'Tier I: Foundations',
    intermediate: 'Tier II: Craft & Sangat',
    advanced: 'Tier III: Master Artistry',
  };

  const isSelectedTierUnlocked = unlockedTiers.includes(selectedTierKey);
  const activeLessons = getTierLessons(selectedTierKey);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>SURJEET SINGH GURUKUL</Text>
              <View style={styles.badgeDot} />
            </View>
            <Text style={styles.welcomeTitle}>
              {profile?.full_name ? `Welcome, ${profile.full_name}` : 'Classical Tabla Gurukul'}
            </Text>
            <Text style={styles.lineageSubtitle}>
              Punjab Gharana Parampara • Direct Guru Lineage
            </Text>
          </View>

          {!user && (
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginPill}
            >
              <Text style={styles.loginPillText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tier Selector Horizontal Pills */}
        <View style={styles.tierSelector}>
          {(['beginner', 'intermediate', 'advanced'] as const).map((tKey) => {
            const isCurrent = selectedTierKey === tKey;
            const isUnlocked = unlockedTiers.includes(tKey);

            return (
              <TouchableOpacity
                key={tKey}
                onPress={() => setSelectedTierKey(tKey)}
                style={[
                  styles.tierPill,
                  isCurrent && styles.tierPillActive,
                ]}
              >
                {!isUnlocked && <Lock size={10} color={isCurrent ? Colors.obsidian : 'rgba(245, 239, 230, 0.4)'} />}
                {isUnlocked && <Unlock size={10} color={isCurrent ? Colors.obsidian : Colors.gold} />}
                <Text
                  style={[
                    styles.tierPillText,
                    isCurrent && styles.tierPillTextActive,
                  ]}
                >
                  {tKey === 'beginner' ? 'Tier I' : tKey === 'intermediate' ? 'Tier II' : 'Tier III'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Tier Spotlight Card */}
        <GlassCard
          variant={isSelectedTierUnlocked ? 'goldAccent' : 'dark'}
          intensity={75}
          style={styles.tierSpotlightCard}
        >
          <View style={styles.tierSpotlightHeader}>
            <View>
              {selectedTierKey === recommendedTier && (
                <View style={styles.recommendedBadge}>
                  <Sparkles size={11} color={Colors.obsidian} />
                  <Text style={styles.recommendedBadgeText}>Guru Recommended</Text>
                </View>
              )}
              <Text style={styles.tierSpotlightTitle}>
                {tierNames[selectedTierKey]}
              </Text>
              <Text style={styles.tierPriceSubtitle}>
                Tuition: ₹{tierPrices[selectedTierKey].toLocaleString()} • Lifetime Access
              </Text>
            </View>

            <View style={styles.lockBadgeContainer}>
              {isSelectedTierUnlocked ? (
                <View style={styles.unlockedIconCircle}>
                  <Unlock size={18} color={Colors.gold} />
                </View>
              ) : (
                <View style={styles.lockedIconCircle}>
                  <Lock size={18} color="rgba(245, 239, 230, 0.5)" />
                </View>
              )}
            </View>
          </View>

          {/* Locked vs Unlocked State Action */}
          {!isSelectedTierUnlocked ? (
            <View style={styles.enrollmentBox}>
              <Text style={styles.enrollmentDesc}>
                {selectedTierKey === recommendedTier
                  ? 'Ustad Surjeet Singh assigned you to this tier. Your ₹400 screening fee is credited automatically.'
                  : 'Master this curriculum tier with HD unlisted video modules, bol notation transcripts, and PDF downloads.'}
              </Text>

              <View style={styles.creditPriceBreakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Course Price:</Text>
                  <Text style={styles.breakdownValue}>₹{tierPrices[selectedTierKey].toLocaleString()}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={[styles.breakdownLabel, { color: Colors.emerald }]}>
                    Screening Credit:
                  </Text>
                  <Text style={[styles.breakdownValue, { color: Colors.emerald }]}>-₹400</Text>
                </View>
                <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                  <Text style={styles.breakdownTotalLabel}>Net Tuition:</Text>
                  <Text style={styles.breakdownTotalValue}>
                    ₹{(tierPrices[selectedTierKey] - 400).toLocaleString()}
                  </Text>
                </View>
              </View>

              <GlassButton
                title={user ? `Enroll for ₹${(tierPrices[selectedTierKey] - 400).toLocaleString()}` : 'Submit Audition for Admission'}
                onPress={() => {
                  if (user) {
                    router.push('/(tabs)/profile');
                  } else {
                    router.push('/(auth)/register-screening');
                  }
                }}
                variant="gold"
                size="md"
                icon={<CreditCard size={14} color={Colors.obsidian} />}
              />
            </View>
          ) : (
            <View style={styles.unlockedBanner}>
              <Text style={styles.unlockedBannerText}>
                ✓ Tier Active • Ready for Sacred Riyaz
              </Text>
            </View>
          )}
        </GlassCard>

        {/* Curriculum Lessons Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curriculum Lessons</Text>
          <Text style={styles.sectionCount}>
            {activeLessons.length} {activeLessons.length === 1 ? 'Module' : 'Modules'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.gold} style={{ marginVertical: 30 }} />
        ) : activeLessons.length === 0 ? (
          <GlassCard variant="dark" intensity={60} style={styles.emptyLessonsCard}>
            <BookOpen size={24} color={Colors.gold} style={{ alignSelf: 'center', marginBottom: 8 }} />
            <Text style={styles.emptyLessonsTitle}>Lessons Initializing</Text>
            <Text style={styles.emptyLessonsDesc}>
              New video lessons published by Ustad Surjeet Singh in Sanity Studio will appear here automatically.
            </Text>
          </GlassCard>
        ) : (
          <View style={styles.lessonsList}>
            {activeLessons.map((lesson) => {
              const isAccessible = isSelectedTierUnlocked;

              return (
                <TouchableOpacity
                  key={lesson._id}
                  activeOpacity={isAccessible ? 0.75 : 0.9}
                  onPress={() => {
                    if (isAccessible) {
                      router.push({
                        pathname: '/course/[lessonSlug]',
                        params: { lessonSlug: lesson.slug?.current || lesson._id },
                      });
                    } else {
                      router.push('/(auth)/register-screening');
                    }
                  }}
                  style={[
                    styles.lessonCard,
                    isAccessible && styles.lessonCardAccessible,
                  ]}
                >
                  <View style={styles.lessonLeft}>
                    <View
                      style={[
                        styles.playIconContainer,
                        isAccessible && styles.playIconContainerAccessible,
                      ]}
                    >
                      {isAccessible ? (
                        <Play size={14} color={Colors.obsidian} fill={Colors.obsidian} />
                      ) : (
                        <Lock size={14} color="rgba(245, 239, 230, 0.4)" />
                      )}
                    </View>

                    <View style={styles.lessonDetails}>
                      <Text style={styles.lessonTaalTag}>
                        MODULE {lesson.moduleNumber} • {lesson.taal}
                      </Text>
                      <Text numberOfLines={1} style={styles.lessonTitle}>
                        {lesson.title}
                      </Text>
                    </View>
                  </View>

                  <ChevronRight size={16} color="rgba(245, 239, 230, 0.3)" />
                </TouchableOpacity>
              );
            })}
          </View>
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
    paddingBottom: 100, // Space for floating bottom tab bar
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  welcomeTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 26,
    color: Colors.ivory,
  },
  lineageSubtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.55)',
    marginTop: 2,
  },
  loginPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
  },
  loginPillText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    textTransform: 'uppercase',
  },
  tierSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tierPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.1)',
  },
  tierPillActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.goldLight,
  },
  tierPillText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.65)',
    textTransform: 'uppercase',
  },
  tierPillTextActive: {
    color: Colors.obsidian,
    fontFamily: Fonts.monoBold,
  },
  tierSpotlightCard: {
    marginBottom: 24,
  },
  tierSpotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  recommendedBadgeText: {
    fontFamily: Fonts.monoBold,
    fontSize: 9,
    color: Colors.obsidian,
    textTransform: 'uppercase',
  },
  tierSpotlightTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 22,
    color: Colors.ivory,
  },
  tierPriceSubtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.65)',
    marginTop: 2,
  },
  lockBadgeContainer: {
    marginLeft: 10,
  },
  unlockedIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(197, 160, 89, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  lockedIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.15)',
  },
  enrollmentBox: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 239, 230, 0.08)',
  },
  enrollmentDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.7)',
    lineHeight: 17,
    marginBottom: 12,
  },
  creditPriceBreakdown: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.08)',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.6)',
  },
  breakdownValue: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.ivory,
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 6,
    marginTop: 4,
  },
  breakdownTotalLabel: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 12,
    color: Colors.ivory,
  },
  breakdownTotalValue: {
    fontFamily: Fonts.monoBold,
    fontSize: 14,
    color: Colors.gold,
  },
  unlockedBanner: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
    alignItems: 'center',
  },
  unlockedBannerText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 20,
    color: Colors.ivory,
  },
  sectionCount: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.45)',
    textTransform: 'uppercase',
  },
  emptyLessonsCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyLessonsTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
    marginBottom: 4,
  },
  emptyLessonsDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.6)',
    textAlign: 'center',
    maxWidth: 280,
  },
  lessonsList: {
    gap: 8,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.08)',
  },
  lessonCardAccessible: {
    backgroundColor: 'rgba(28, 25, 26, 0.7)',
    borderColor: 'rgba(197, 160, 89, 0.25)',
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  playIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconContainerAccessible: {
    backgroundColor: Colors.gold,
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTaalTag: {
    fontFamily: Fonts.monoMedium,
    fontSize: 9,
    color: Colors.gold,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  lessonTitle: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.ivory,
  },
});
