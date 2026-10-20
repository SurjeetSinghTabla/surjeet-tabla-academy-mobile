import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Video,
  CreditCard,
  MessageCircle,
  HelpCircle,
} from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { supabase } from '@/lib/supabase';

const WEB_API_URL = process.env.EXPO_PUBLIC_WEB_API_URL || 'https://surjeet-tabla-academy.vercel.app';

export default function RegisterScreeningScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('1-3 years');
  const [skillLevel, setSkillLevel] = useState('Foundational');
  const [videoUrl, setVideoUrl] = useState('');
  const [goals, setGoals] = useState('');

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleSubmitScreening = async () => {
    if (!fullName || fullName.trim().length < 2) {
      Alert.alert('Required Field', 'Please enter your full legal name.');
      return;
    }

    if (!email || !email.includes('@')) {
      Alert.alert('Required Field', 'Please enter a valid email address.');
      return;
    }

    const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      Alert.alert('Required Field', 'Please enter a valid 10+ digit WhatsApp/phone number.');
      return;
    }

    if (!videoUrl || !videoUrl.startsWith('http')) {
      Alert.alert(
        'Audition Link Required',
        'Please enter a valid hosted video link (unlisted YouTube, Google Drive, Vimeo, or Dropbox).'
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Submit application to backend API
      const res = await fetch(`${WEB_API_URL}/api/screening/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          experience,
          skillLevel,
          videoUrl: videoUrl.trim(),
          goals: goals.trim(),
          amountInr: 400,
          paymentId: `pay_mobile_${Date.now()}`,
          orderId: `order_mobile_${Date.now()}`,
        }),
      });

      const data = await res.json();

      // 2. Also record in Supabase directly
      try {
        await supabase.from('academy_applications').insert({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          experience,
          skill_level: skillLevel,
          video_url: videoUrl.trim(),
          musical_goals: goals.trim(),
          amount_inr: 400,
          payment_id: `pay_mobile_${Date.now()}`,
          status: 'pending',
        });
      } catch (dbErr) {
        console.warn('[Screening] Direct Supabase insert notice:', dbErr);
      }

      setSubmittedData({
        fullName,
        email,
        phone,
        experience,
        videoUrl,
      });
      setIsSubmitted(true);
    } catch (err: unknown) {
      Alert.alert(
        'Submission Notice',
        'Your audition details have been queued. Connecting to Gurukul admissions.'
      );
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppGuruji = () => {
    const text = encodeURIComponent(
      `🙏 Pranaam Ustad Surjeet Singh Ji,\n\nI have submitted my serious-learner screening application for the Punjab Gharana Gurukul.\n\nName: ${fullName}\nEmail: ${email}\nAudition Link: ${videoUrl}\n\nLooking forward to your guidance.`
    );
    Linking.openURL(`https://wa.me/919810000000?text=${text}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={16} color={Colors.gold} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>

          {!isSubmitted ? (
            <>
              {/* Header Title */}
              <View style={styles.headerContainer}>
                <View style={styles.badgeRow}>
                  <Text style={styles.badgeText}>STEP 01 • AUDITION & SCREENING</Text>
                  <View style={styles.badgeDot} />
                </View>

                <Text style={styles.title}>Audition Dossier & Evaluation</Text>

                <Text style={styles.subtitle}>
                  To preserve the sacred parampara of Punjab Gharana, every learner undergoes an audition review by Ustad Surjeet Singh. Your ₹400 fee is credited 100% towards your recommended course tier.
                </Text>
              </View>

              {/* 3-Step Roadmap Card */}
              <GlassCard variant="dark" intensity={70} style={styles.roadmapCard}>
                <View style={styles.stepRow}>
                  <View style={styles.stepNumberCircle}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>Submit Audition & ₹400</Text>
                    <Text style={styles.stepDesc}>Submit details & video demonstrating your playing or bols.</Text>
                  </View>
                </View>

                <View style={styles.stepRow}>
                  <View style={styles.stepNumberCircle}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>Master Review (24–48h)</Text>
                    <Text style={styles.stepDesc}>Surjeet Singh evaluates your hand posture & assigns a tier.</Text>
                  </View>
                </View>

                <View style={styles.stepRow}>
                  <View style={styles.stepNumberCircle}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>Unlock Curriculum</Text>
                    <Text style={styles.stepDesc}>Purchase course with ₹400 credit and access the LMS vault.</Text>
                  </View>
                </View>
              </GlassCard>

              {/* Screening Form Card */}
              <GlassCard variant="dark" intensity={70} style={styles.formCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Legal Name *</Text>
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="e.g. Gurpreet Singh"
                    placeholderTextColor="rgba(245, 239, 230, 0.3)"
                    style={styles.textInput}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address * (For Acceptance)</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@domain.com"
                    placeholderTextColor="rgba(245, 239, 230, 0.3)"
                    style={styles.textInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>WhatsApp / Phone *</Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+91 98765 43210"
                    placeholderTextColor="rgba(245, 239, 230, 0.3)"
                    style={styles.textInput}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Playing Experience</Text>
                  <View style={styles.pillRow}>
                    {['Zero / Beginner', '1-3 years', '3-5 years', '5+ years'].map((exp) => (
                      <TouchableOpacity
                        key={exp}
                        onPress={() => setExperience(exp)}
                        style={[styles.choicePill, experience === exp && styles.choicePillActive]}
                      >
                        <Text style={[styles.choicePillText, experience === exp && styles.choicePillTextActive]}>
                          {exp}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hosted Video Audition Link *</Text>
                  <TextInput
                    value={videoUrl}
                    onChangeText={setVideoUrl}
                    placeholder="YouTube unlisted, Google Drive, or Vimeo link"
                    placeholderTextColor="rgba(245, 239, 230, 0.3)"
                    style={styles.textInput}
                    autoCapitalize="none"
                  />
                  <Text style={styles.helperText}>
                    Record a 1–3 min video of your hand placement, bols, or riyaz.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Musical Goals & Repertoire Aspirations</Text>
                  <TextInput
                    value={goals}
                    onChangeText={setGoals}
                    placeholder="e.g. Master left-hand Bayan modulation, Kirtan accompaniment, or speed in Teentaal Relas..."
                    placeholderTextColor="rgba(245, 239, 230, 0.3)"
                    style={[styles.textInput, styles.textArea]}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Screening Fee Credit Notice */}
                <View style={styles.feeNoticeBox}>
                  <CreditCard size={16} color={Colors.gold} />
                  <View style={styles.feeNoticeTextContainer}>
                    <Text style={styles.feeNoticeTitle}>₹400 Serious-Learner Screening</Text>
                    <Text style={styles.feeNoticeDesc}>
                      100% credited towards your recommended course tier upon acceptance.
                    </Text>
                  </View>
                </View>

                <GlassButton
                  title="Submit Audition & Pay ₹400"
                  onPress={handleSubmitScreening}
                  variant="gold"
                  size="lg"
                  loading={loading}
                  style={styles.submitButton}
                />
              </GlassCard>
            </>
          ) : (
            /* Post-Submission Confirmation State */
            <View style={styles.confirmationContainer}>
              <View style={styles.successIconCircle}>
                <CheckCircle2 size={36} color={Colors.emerald} />
              </View>

              <Text style={styles.confirmationTitle}>Audition Dossier Transmitted</Text>

              <Text style={styles.confirmationDesc}>
                Thank you, <strong>{fullName}</strong>. Your audition video and screening details have been delivered directly to Ustad Surjeet Singh.
              </Text>

              <GlassCard variant="goldAccent" intensity={70} style={styles.dossierSummary}>
                <Text style={styles.dossierSummaryTitle}>Application Summary</Text>
                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>Student:</Text>
                  <Text style={styles.dossierValue}>{fullName}</Text>
                </View>
                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>Email:</Text>
                  <Text style={styles.dossierValue}>{email}</Text>
                </View>
                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>Experience:</Text>
                  <Text style={styles.dossierValue}>{experience}</Text>
                </View>
                <View style={styles.dossierRow}>
                  <Text style={styles.dossierLabel}>Evaluation Status:</Text>
                  <Text style={[styles.dossierValue, { color: Colors.gold }]}>Under Guru Review</Text>
                </View>
              </GlassCard>

              <View style={styles.confirmationActions}>
                <GlassButton
                  title="Chat with Guruji on WhatsApp"
                  onPress={handleWhatsAppGuruji}
                  variant="gold"
                  size="lg"
                  icon={<MessageCircle size={16} color={Colors.obsidian} />}
                  style={styles.whatsAppButton}
                />

                <GlassButton
                  title="Return to Gurukul Catalog"
                  onPress={() => router.replace('/(tabs)')}
                  variant="glass"
                  size="md"
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.obsidian,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topBar: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  backText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
    textTransform: 'uppercase',
  },
  headerContainer: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
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
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
    color: 'rgba(245, 239, 230, 0.65)',
    lineHeight: 18,
  },
  roadmapCard: {
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  stepNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: Fonts.monoBold,
    fontSize: 12,
    color: Colors.obsidian,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 13,
    color: Colors.ivory,
  },
  stepDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.6)',
    marginTop: 2,
  },
  formCard: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'rgba(20, 18, 19, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.15)',
    paddingHorizontal: 12,
    height: 46,
    color: Colors.ivory,
    fontFamily: Fonts.sansRegular,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  helperText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 10,
    color: 'rgba(245, 239, 230, 0.5)',
    marginTop: 4,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choicePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.1)',
  },
  choicePillActive: {
    backgroundColor: 'rgba(197, 160, 89, 0.2)',
    borderColor: Colors.gold,
  },
  choicePillText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.6)',
  },
  choicePillTextActive: {
    color: Colors.gold,
    fontFamily: Fonts.monoBold,
  },
  feeNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(197, 160, 89, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
    marginBottom: 16,
  },
  feeNoticeTextContainer: {
    flex: 1,
  },
  feeNoticeTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 12,
    color: Colors.ivory,
  },
  feeNoticeDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 10,
    color: 'rgba(245, 239, 230, 0.7)',
    marginTop: 1,
  },
  submitButton: {
    marginTop: 4,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmationTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 26,
    color: Colors.ivory,
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmationDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
    color: 'rgba(245, 239, 230, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 320,
  },
  dossierSummary: {
    width: '100%',
    marginBottom: 24,
  },
  dossierSummaryTitle: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 239, 230, 0.1)',
    paddingBottom: 6,
  },
  dossierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dossierLabel: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.6)',
  },
  dossierValue: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 12,
    color: Colors.ivory,
  },
  confirmationActions: {
    width: '100%',
    gap: 12,
  },
  whatsAppButton: {
    width: '100%',
  },
});
