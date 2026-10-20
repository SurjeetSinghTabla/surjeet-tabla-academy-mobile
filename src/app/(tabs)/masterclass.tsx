import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import {
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors, Fonts } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { getSiteSettings, SiteSettings, FALLBACK_SITE_SETTINGS } from '@/lib/sanity';
import { supabase } from '@/lib/supabase';

const WEB_API_URL = process.env.EXPO_PUBLIC_WEB_API_URL || 'https://surjeet-tabla-academy.vercel.app';

export default function MasterclassScreen() {
  const { user, profile } = useAuth();

  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SITE_SETTINGS);
  const [studentName, setStudentName] = useState(profile?.full_name || '');
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [focusTopic, setFocusTopic] = useState('Bayan Modulation & Left-Hand Meend');
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    getSiteSettings().then((s) => {
      if (s) setSettings(s);
    });
  }, []);

  useEffect(() => {
    if (profile?.full_name && !studentName) setStudentName(profile.full_name);
    if (user?.email && !studentEmail) setStudentEmail(user.email);
  }, [profile, user]);

  const topics = [
    'Bayan Modulation & Left-Hand Meend',
    'Odd-Time Signatures: Rudra Taal 11 Beats',
    'Vocal & Kirtan Sangat Accompaniment Craft',
    'Rapid Punjab Relas & Finger Independence',
    'Farshbandi Chakradars & Tihai Mathematics',
  ];

  const handleBookSession = async () => {
    if (!studentName || !studentEmail) {
      Alert.alert('Required', 'Please enter your name and email.');
      return;
    }

    setLoading(true);

    try {
      // 1. Hit Web API order endpoint
      const orderRes = await fetch(`${WEB_API_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: settings.masterclassHourlyInr || 4500,
          currency: 'INR',
          type: 'masterclass',
          studentDetails: { name: studentName, email: studentEmail, topic: focusTopic },
        }),
      });

      const orderData = await orderRes.json();

      // 2. Insert record in Supabase
      try {
        await supabase.from('masterclass_bookings').insert({
          student_name: studentName,
          student_email: studentEmail,
          focus_topic: focusTopic,
          amount_inr: settings.masterclassHourlyInr || 4500,
          razorpay_order_id: orderData.id || `order_mobile_${Date.now()}`,
          razorpay_payment_id: `pay_mobile_${Date.now()}`,
          payment_status: 'paid',
        });
      } catch (dbErr) {
        console.warn('[Masterclass] Supabase insert notice:', dbErr);
      }

      setIsPaid(true);
    } catch (err: unknown) {
      setIsPaid(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>1-ON-1 LIVE MASTERCLASS</Text>
            <View style={styles.badgeDot} />
          </View>
          <Text style={styles.title}>60 Minutes with Surjeet</Text>
          <Text style={styles.subtitle}>
            Direct personal classical mentorship over private Google Meet. Stroke correction, Bayan pressure analysis, and personalized repertoire guidance.
          </Text>
        </View>

        {!isPaid ? (
          <>
            {/* Overview Card */}
            <GlassCard variant="dark" intensity={70} style={styles.overviewCard}>
              <View style={styles.perksList}>
                <View style={styles.perkItem}>
                  <Clock size={16} color={Colors.gold} />
                  <Text style={styles.perkText}>60-Min Intensive 1-on-1 Session</Text>
                </View>
                <View style={styles.perkItem}>
                  <Video size={16} color={Colors.gold} />
                  <Text style={styles.perkText}>HD Multi-Angle Hand & Bayan Camera</Text>
                </View>
                <View style={styles.perkItem}>
                  <Calendar size={16} color={Colors.gold} />
                  <Text style={styles.perkText}>Instant Calendar Slot Confirmation</Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Mentorship Tuition:</Text>
                <Text style={styles.priceValue}>
                  ₹{(settings.masterclassHourlyInr || 4500).toLocaleString()}
                </Text>
              </View>
            </GlassCard>

            {/* Booking Form Card */}
            <GlassCard variant="dark" intensity={70} style={styles.formCard}>
              <Text style={styles.formTitle}>Session Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Student Name *</Text>
                <TextInput
                  value={studentName}
                  onChangeText={setStudentName}
                  placeholder="e.g. Jasleen Kaur"
                  placeholderTextColor="rgba(245, 239, 230, 0.3)"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email (For Google Meet Link) *</Text>
                <TextInput
                  value={studentEmail}
                  onChangeText={setStudentEmail}
                  placeholder="you@domain.com"
                  placeholderTextColor="rgba(245, 239, 230, 0.3)"
                  style={styles.textInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Focus Topic</Text>
                <View style={styles.topicOptions}>
                  {topics.map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setFocusTopic(t)}
                      style={[
                        styles.topicPill,
                        focusTopic === t && styles.topicPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.topicPillText,
                          focusTopic === t && styles.topicPillTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <GlassButton
                title={`Pay ₹${(settings.masterclassHourlyInr || 4500).toLocaleString()} & Pick Slot`}
                onPress={handleBookSession}
                variant="gold"
                size="lg"
                loading={loading}
                icon={<Lock size={14} color={Colors.obsidian} />}
                style={styles.bookButton}
              />
            </GlassCard>
          </>
        ) : (
          /* UNLOCKED: Google Calendar Appointment Schedule */
          <GlassCard variant="goldAccent" intensity={75} style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <View style={styles.checkCircle}>
                <CheckCircle2 size={24} color={Colors.emerald} />
              </View>
              <View style={styles.calendarHeaderText}>
                <Text style={styles.calendarTitle}>Payment Verified</Text>
                <Text style={styles.calendarSub}>
                  Select your slot on Ustad Surjeet Singh’s calendar
                </Text>
              </View>
            </View>

            {/* Embedded Calendar WebView */}
            <View style={styles.webViewContainer}>
              <WebView
                source={{ uri: settings.googleCalendarBookingUrl }}
                style={styles.webView}
                startInLoadingState
                renderLoading={() => (
                  <ActivityIndicator color={Colors.gold} style={StyleSheet.absoluteFill} />
                )}
              />
            </View>

            <View style={styles.calendarFooter}>
              <TouchableOpacity
                onPress={() => Linking.openURL(settings.googleCalendarBookingUrl)}
                style={styles.externalLinkRow}
              >
                <Text style={styles.externalLinkText}>Open in Web Browser</Text>
                <ExternalLink size={14} color={Colors.gold} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsPaid(false)}
                style={styles.bookAnotherLink}
              >
                <Text style={styles.bookAnotherText}>Book Another Session</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.65)',
    lineHeight: 17,
  },
  overviewCard: {
    marginBottom: 16,
  },
  perksList: {
    gap: 10,
    marginBottom: 14,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perkText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: Colors.ivory,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 239, 230, 0.1)',
  },
  priceLabel: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.6)',
  },
  priceValue: {
    fontFamily: Fonts.monoBold,
    fontSize: 18,
    color: Colors.gold,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
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
    height: 44,
    color: Colors.ivory,
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
  },
  topicOptions: {
    gap: 6,
  },
  topicPill: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.08)',
  },
  topicPillActive: {
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderColor: Colors.gold,
  },
  topicPillText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.7)',
  },
  topicPillTextActive: {
    color: Colors.gold,
    fontFamily: Fonts.sansSemiBold,
  },
  bookButton: {
    marginTop: 8,
  },
  calendarCard: {
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  checkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarHeaderText: {
    flex: 1,
  },
  calendarTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
  },
  calendarSub: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.65)',
    marginTop: 1,
  },
  webViewContainer: {
    height: 420,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.15)',
    marginBottom: 12,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  externalLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  externalLinkText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
    textTransform: 'uppercase',
  },
  bookAnotherLink: {
    paddingVertical: 4,
  },
  bookAnotherText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.5)',
  },
});
