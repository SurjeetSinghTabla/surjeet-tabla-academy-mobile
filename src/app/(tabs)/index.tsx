import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
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
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  ShieldCheck,
  Music,
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

const SURJEET_HERO_IMG = require('../../../assets/images/surjeet-hero.png');

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

  // When logged in, select the recommended tier by default if available
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

  const tierSubtitles: Record<'beginner' | 'intermediate' | 'advanced', string> = {
    beginner: 'Seating posture, Dayan/Bayan tuning, the 4 Nikas strokes & Teentaal Kaydas',
    intermediate: 'Left-hand Bayan Meend modulation, rapid Punjab Relas & vocal accompaniment',
    advanced: 'Odd-time Taals (Rudra 11 beats, Matta 9 beats), Chakradars & concert solos',
  };

  const isSelectedTierUnlocked = unlockedTiers.includes(selectedTierKey);
  const activeLessons = getTierLessons(selectedTierKey);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
      >
        {/* ========================================================================= */}
        {/* TOP BRANDING BAR                                                          */}
        {/* ========================================================================= */}
        <View style={styles.topHeader}>
          <View>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>SURJEET SINGH DIGITAL GURUKUL</Text>
              <View style={styles.badgeDot} />
            </View>
            <Text style={styles.welcomeTitle}>
              {user ? (profile?.full_name ? `Welcome, ${profile.full_name}` : 'Disciple Vault') : 'Classical Tabla Parampara'}
            </Text>
            <Text style={styles.lineageSubtitle}>
              Punjab Gharana Heritage • Direct Guru Lineage
            </Text>
          </View>

          {!user ? (
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={styles.signInButton}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.profileBadge}
              activeOpacity={0.8}
            >
              <GraduationCap size={16} color={Colors.gold} />
            </TouchableOpacity>
          )}
        </View>

        {/* ========================================================================= */}
        {/* GUEST VIEW: HERO BANNER & 3-STEP ADMISSION ROADMAP                        */}
        {/* (Curriculum lessons are hidden until student logs in to their account)     */}
        {/* ========================================================================= */}
        {!user ? (
          <View style={styles.guestContainer}>
            {/* Visual Hero Banner with Surjeet's authentic portrait */}
            <View style={styles.heroCard}>
              <Image
                source={SURJEET_HERO_IMG}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.heroOverlay}>
                <View style={styles.heroTagRow}>
                  <Text style={styles.heroTagText}>ACADEMY ADMISSION</Text>
                  <Sparkles size={12} color={Colors.gold} />
                </View>
                <Text style={styles.heroHeading}>
                  Study Authentic Punjab Gharana Tabla
                </Text>
                <Text style={styles.heroSubtext}>
                  Selective disciple enrollment under virtuoso Surjeet Singh. Every student receives personalized hand posture and stroke evaluations.
                </Text>

                <View style={styles.quotePill}>
                  <Text style={styles.quoteText}>
                    &ldquo;Riyaz karoge toh Raaj karoge.&rdquo;
                  </Text>
                </View>
              </View>
            </View>

            {/* 3-STEP ADMISSION PROTOCOL */}
            <View style={styles.protocolSection}>
              <View style={styles.sectionHeadingWrapper}>
                <Text style={styles.sectionSuper}>HOW ADMISSION WORKS</Text>
                <Text style={styles.sectionHeading}>The 3-Step Admission Protocol</Text>
                <Text style={styles.sectionLead}>
                  To uphold the sacred standards of the Punjab Gharana, admission is granted only after a personal audition review by Surjeet Singh.
                </Text>
              </View>

              {/* Step 1 Card */}
              <GlassCard variant="dark" intensity={70} style={styles.stepCard}>
                <View style={styles.stepHeaderRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>STEP 01</Text>
                  </View>
                  <Text style={styles.stepFeeBadge}>₹400 Screening Fee</Text>
                </View>

                <Text style={styles.stepTitle}>Submit Audition & Intake Form</Text>
                <Text style={styles.stepDesc}>
                  Takes ~2 minutes. Enter your musical background and submit an unlisted video link (YouTube, Drive, or phone recording) showing your hand posture and basic strokes.
                </Text>

                <View style={styles.stepHighlightRow}>
                  <CheckCircle2 size={13} color={Colors.gold} />
                  <Text style={styles.stepHighlightText}>
                    100% of the ₹400 fee is credited toward your course tuition.
                  </Text>
                </View>
              </GlassCard>

              {/* Step 2 Card */}
              <GlassCard variant="dark" intensity={70} style={styles.stepCard}>
                <View style={styles.stepHeaderRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>STEP 02</Text>
                  </View>
                  <View style={styles.stepTimeBadge}>
                    <Clock size={11} color={Colors.gold} />
                    <Text style={styles.stepTimeBadgeText}>24–48 Hours</Text>
                  </View>
                </View>

                <Text style={styles.stepTitle}>Master Review & Recommendation</Text>
                <Text style={styles.stepDesc}>
                  Surjeet Singh personally reviews your audition video, analyzing your Dayan/Bayan balance, wrist ergonomics, and rhythmic sense. He approves your admission and assigns your ideal starting tier.
                </Text>

                <View style={styles.stepHighlightRow}>
                  <CheckCircle2 size={13} color={Colors.emerald} />
                  <Text style={styles.stepHighlightText}>
                    Receive official acceptance & tier recommendation via email.
                  </Text>
                </View>
              </GlassCard>

              {/* Step 3 Card */}
              <GlassCard variant="dark" intensity={70} style={styles.stepCard}>
                <View style={styles.stepHeaderRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>STEP 03</Text>
                  </View>
                  <Text style={styles.stepLifetimeBadge}>Lifetime Access</Text>
                </View>

                <Text style={styles.stepTitle}>Enroll in Recommended Tier & Unlock Vault</Text>
                <Text style={styles.stepDesc}>
                  Create your student login, sign into this app, and purchase your assigned tier. Your ₹400 screening fee is automatically deducted at checkout, granting instant access to all lessons and bol notations.
                </Text>

                <View style={styles.stepHighlightRow}>
                  <CheckCircle2 size={13} color={Colors.gold} />
                  <Text style={styles.stepHighlightText}>
                    Full access to HD unlisted video modules, bol PDFs & updates.
                  </Text>
                </View>
              </GlassCard>
            </View>

            {/* CURRICULUM TIERS OVERVIEW */}
            <View style={styles.curriculumArchitectureSection}>
              <Text style={styles.sectionSuper}>CURRICULUM ARCHITECTURE</Text>
              <Text style={styles.sectionHeading}>The Three Progressive Tiers</Text>

              <View style={styles.tierCardsStack}>
                {(['beginner', 'intermediate', 'advanced'] as const).map((tKey) => {
                  const isPopular = tKey === 'intermediate';
                  return (
                    <GlassCard
                      key={tKey}
                      variant={isPopular ? 'goldAccent' : 'dark'}
                      intensity={75}
                      style={styles.tierArchCard}
                    >
                      <View style={styles.tierArchHeader}>
                        <View>
                          <Text style={styles.tierArchName}>{tierNames[tKey]}</Text>
                          <Text style={styles.tierArchSubtitle}>{tierSubtitles[tKey]}</Text>
                        </View>
                        <Text style={styles.tierArchPrice}>₹{tierPrices[tKey].toLocaleString()}</Text>
                      </View>

                      <View style={styles.tierArchFooter}>
                        <View style={styles.tierArchGatedNotice}>
                          <Lock size={12} color="rgba(245, 239, 230, 0.5)" />
                          <Text style={styles.tierArchGatedText}>
                            Lessons unlock upon admission approval & account sign-in
                          </Text>
                        </View>
                      </View>
                    </GlassCard>
                  );
                })}
              </View>
            </View>

            {/* GUEST ACTION CTA BUTTONS */}
            <View style={styles.guestActionContainer}>
              <GlassButton
                title="Begin 3-Step Admission (₹400)"
                onPress={() => router.push('/(auth)/register-screening')}
                variant="gold"
                size="lg"
                icon={<ArrowRight size={16} color={Colors.obsidian} />}
                style={styles.primaryCta}
              />

              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                style={styles.secondarySignInButton}
                activeOpacity={0.7}
              >
                <Text style={styles.secondarySignInText}>
                  Already Screened or Accepted? <Text style={styles.secondarySignInBold}>Disciple Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ========================================================================= */
          /* LOGGED-IN DISCIPLE VIEW: FULL CURRICULUM ACCESS & TIER LMS               */
          /* ========================================================================= */
          <View style={styles.discipleContainer}>
            {/* Disciple Admission Status Card */}
            <GlassCard
              variant={isSelectedTierUnlocked ? 'goldAccent' : 'dark'}
              intensity={75}
              style={styles.discipleStatusCard}
            >
              <View style={styles.statusHeaderRow}>
                <View>
                  <View style={styles.statusBadgeRow}>
                    <ShieldCheck size={14} color={Colors.gold} />
                    <Text style={styles.statusBadgeText}>ACADEMY DISCIPLE ACCOUNT</Text>
                  </View>
                  <Text style={styles.discipleTierTitle}>
                    {recommendedTier ? `Recommended: ${tierNames[recommendedTier]}` : 'Gurukul Student'}
                  </Text>
                </View>

                {isSelectedTierUnlocked ? (
                  <View style={styles.activeTierPill}>
                    <CheckCircle2 size={13} color={Colors.emerald} />
                    <Text style={styles.activeTierPillText}>UNLOCKED</Text>
                  </View>
                ) : (
                  <View style={styles.lockedTierPill}>
                    <Lock size={12} color={Colors.gold} />
                    <Text style={styles.lockedTierPillText}>LOCKED</Text>
                  </View>
                )}
              </View>

              {!isSelectedTierUnlocked ? (
                <View style={styles.enrollmentCreditBox}>
                  <Text style={styles.enrollmentCreditDesc}>
                    {selectedTierKey === recommendedTier
                      ? 'Surjeet Singh approved your admission and assigned you this tier. Your ₹400 screening fee is credited automatically.'
                      : 'Enroll in this tier to unlock all HD unlisted lessons, bol notation sheets, and PDF downloads.'}
                  </Text>

                  <View style={styles.creditPriceBreakdown}>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>Course Tuition:</Text>
                      <Text style={styles.breakdownValue}>₹{tierPrices[selectedTierKey].toLocaleString()}</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                      <Text style={[styles.breakdownLabel, { color: Colors.emerald }]}>
                        Screening Fee Credit:
                      </Text>
                      <Text style={[styles.breakdownValue, { color: Colors.emerald }]}>-₹400</Text>
                    </View>
                    <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                      <Text style={styles.breakdownTotalLabel}>Net Amount Due:</Text>
                      <Text style={styles.breakdownTotalValue}>
                        ₹{(tierPrices[selectedTierKey] - 400).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <GlassButton
                    title={`Unlock for ₹${(tierPrices[selectedTierKey] - 400).toLocaleString()}`}
                    onPress={() => router.push('/(tabs)/profile')}
                    variant="gold"
                    size="md"
                    icon={<CreditCard size={14} color={Colors.obsidian} />}
                  />
                </View>
              ) : (
                <View style={styles.activeTierBanner}>
                  <Text style={styles.activeTierBannerText}>
                    ✓ All modules active • Tap any lesson below to begin riyaz
                  </Text>
                </View>
              )}
            </GlassCard>

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
                    {!isUnlocked ? (
                      <Lock size={10} color={isCurrent ? Colors.obsidian : 'rgba(245, 239, 230, 0.4)'} />
                    ) : (
                      <Unlock size={10} color={isCurrent ? Colors.obsidian : Colors.gold} />
                    )}
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

            {/* Curriculum Lessons Section */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Curriculum Lessons</Text>
                <Text style={styles.sectionSubtitle}>{tierNames[selectedTierKey]}</Text>
              </View>
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
                  Video lessons published by Ustad Surjeet Singh in Sanity Studio will appear here automatically.
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
                          router.push('/(tabs)/profile');
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
    paddingBottom: 110, // Space for floating bottom tab bar
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
    fontSize: 9,
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
    fontSize: 24,
    color: Colors.ivory,
  },
  lineageSubtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.55)',
    marginTop: 2,
  },
  signInButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.35)',
  },
  signInButtonText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Guest View Styles */
  guestContainer: {
    gap: 24,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1C191A',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
    position: 'relative',
    height: 340,
    justifyContent: 'flex-end',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.72,
  },
  heroOverlay: {
    padding: 20,
    backgroundColor: 'rgba(20, 18, 19, 0.82)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  heroTagText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  heroHeading: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 22,
    color: Colors.ivory,
    lineHeight: 28,
    marginBottom: 6,
  },
  heroSubtext: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.75)',
    lineHeight: 17,
    marginBottom: 10,
  },
  quotePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(197, 160, 89, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
  },
  quoteText: {
    fontFamily: Fonts.serifItalic,
    fontSize: 13,
    color: Colors.gold,
  },

  /* Protocol Section */
  protocolSection: {
    gap: 12,
  },
  sectionHeadingWrapper: {
    marginBottom: 6,
  },
  sectionSuper: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sectionHeading: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 24,
    color: Colors.ivory,
    marginBottom: 6,
  },
  sectionLead: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.65)',
    lineHeight: 18,
  },
  stepCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.12)',
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepBadge: {
    backgroundColor: Colors.burgundy,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
  },
  stepBadgeText: {
    fontFamily: Fonts.monoBold,
    fontSize: 9,
    color: Colors.ivory,
    letterSpacing: 1,
  },
  stepFeeBadge: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
    fontWeight: '600',
  },
  stepTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepTimeBadgeText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
  },
  stepLifetimeBadge: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.emerald,
  },
  stepTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
    marginBottom: 6,
  },
  stepDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.7)',
    lineHeight: 18,
    marginBottom: 10,
  },
  stepHighlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 239, 230, 0.08)',
  },
  stepHighlightText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.85)',
    flex: 1,
  },

  /* Curriculum Architecture Preview */
  curriculumArchitectureSection: {
    gap: 12,
  },
  tierCardsStack: {
    gap: 10,
  },
  tierArchCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
  },
  tierArchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tierArchName: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
  },
  tierArchSubtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.6)',
    marginTop: 2,
    maxWidth: 240,
  },
  tierArchPrice: {
    fontFamily: Fonts.monoBold,
    fontSize: 16,
    color: Colors.gold,
  },
  tierArchFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 239, 230, 0.08)',
  },
  tierArchGatedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierArchGatedText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: 'rgba(245, 239, 230, 0.5)',
  },

  /* Guest Action CTAs */
  guestActionContainer: {
    gap: 12,
    paddingTop: 8,
  },
  primaryCta: {
    width: '100%',
  },
  secondarySignInButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondarySignInText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.65)',
  },
  secondarySignInBold: {
    color: Colors.gold,
    fontFamily: Fonts.sansSemiBold,
    textDecorationLine: 'underline',
  },

  /* Logged-in Disciple Styles */
  discipleContainer: {
    gap: 20,
  },
  discipleStatusCard: {
    marginBottom: 4,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  statusBadgeText: {
    fontFamily: Fonts.monoBold,
    fontSize: 9,
    color: Colors.gold,
    letterSpacing: 1,
  },
  discipleTierTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 20,
    color: Colors.ivory,
  },
  activeTierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  activeTierPillText: {
    fontFamily: Fonts.monoBold,
    fontSize: 9,
    color: Colors.emerald,
  },
  lockedTierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
  },
  lockedTierPillText: {
    fontFamily: Fonts.monoBold,
    fontSize: 9,
    color: Colors.gold,
  },
  enrollmentCreditBox: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 239, 230, 0.08)',
  },
  enrollmentCreditDesc: {
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
  activeTierBanner: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(197, 160, 89, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
    alignItems: 'center',
  },
  activeTierBannerText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
  },
  tierSelector: {
    flexDirection: 'row',
    gap: 8,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 22,
    color: Colors.ivory,
  },
  sectionSubtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: Colors.gold,
    marginTop: 2,
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
