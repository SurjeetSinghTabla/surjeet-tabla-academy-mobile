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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Mail, User, Phone, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors, Fonts } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    if (mode === 'signin') {
      const res = await signIn(email, password);
      setLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      if (!fullName || !phone) {
        setLoading(false);
        setErrorMessage('Please fill in your full name and phone number.');
        return;
      }
      const res = await signUp(email, password, fullName, phone);
      setLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        Alert.alert(
          'Account Created',
          'Your Gurukul portal account has been established. Welcome, disciple.',
          [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar with back to guest view */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              style={styles.backButton}
            >
              <ArrowLeft size={16} color={Colors.gold} />
              <Text style={styles.backText}>Explore as Guest</Text>
            </TouchableOpacity>
          </View>

          {/* Header Typography */}
          <View style={styles.headerContainer}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>PUNJAB GHARANA GURUKUL</Text>
              <View style={styles.badgeDot} />
            </View>

            <Text style={styles.title}>
              {mode === 'signin' ? 'Disciple Sign In' : 'Activate Portal Account'}
            </Text>

            <Text style={styles.subtitle}>
              {mode === 'signin'
                ? 'Sign in to access your unlocked curriculum tiers, bol notation transcripts, and live masterclass records.'
                : 'For audition-approved disciples. Create your portal credentials to unlock assigned curriculum tiers.'}
            </Text>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.modeTabs}>
            <TouchableOpacity
              onPress={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              style={[styles.modeTab, mode === 'signin' && styles.modeTabActive]}
            >
              <Text style={[styles.modeTabText, mode === 'signin' && styles.modeTabTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              style={[styles.modeTab, mode === 'signup' && styles.modeTabActive]}
            >
              <Text style={[styles.modeTabText, mode === 'signup' && styles.modeTabTextActive]}>
                New Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <GlassCard variant="dark" intensity={70} style={styles.formCard}>
            {errorMessage && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {mode === 'signup' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <User size={16} color="rgba(245, 239, 230, 0.4)" style={styles.inputIcon} />
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="e.g. Jasleen Kaur"
                      placeholderTextColor="rgba(245, 239, 230, 0.3)"
                      style={styles.textInput}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>WhatsApp / Phone</Text>
                  <View style={styles.inputWrapper}>
                    <Phone size={16} color="rgba(245, 239, 230, 0.4)" style={styles.inputIcon} />
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="+91 98765 43210"
                      placeholderTextColor="rgba(245, 239, 230, 0.3)"
                      style={styles.textInput}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail size={16} color="rgba(245, 239, 230, 0.4)" style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="disciple@domain.com"
                  placeholderTextColor="rgba(245, 239, 230, 0.3)"
                  style={styles.textInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={16} color="rgba(245, 239, 230, 0.4)" style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(245, 239, 230, 0.3)"
                  style={styles.textInput}
                  secureTextEntry
                />
              </View>
            </View>

            <GlassButton
              title={mode === 'signin' ? 'Sign In to Gurukul' : 'Create Portal Account'}
              onPress={handleSubmit}
              variant="gold"
              size="lg"
              loading={loading}
              style={styles.submitButton}
            />
          </GlassCard>

          {/* New Learner Screening CTA */}
          <View style={styles.screeningBox}>
            <View style={styles.screeningIcon}>
              <Sparkles size={18} color={Colors.gold} />
            </View>
            <View style={styles.screeningContent}>
              <Text style={styles.screeningTitle}>Haven’t Completed Screening Yet?</Text>
              <Text style={styles.screeningDescription}>
                Admission requires a hosted video audition and ₹400 screening fee reviewed directly by Ustad Surjeet Singh.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/register-screening')}
                style={styles.screeningLink}
              >
                <Text style={styles.screeningLinkText}>Submit Audition & Screening</Text>
                <ArrowRight size={14} color={Colors.gold} />
              </TouchableOpacity>
            </View>
          </View>
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
    marginBottom: 20,
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
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
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
    fontSize: 32,
    color: Colors.ivory,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
    color: 'rgba(245, 239, 230, 0.65)',
    lineHeight: 18,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.08)',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: Colors.gold,
  },
  modeTabText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    textTransform: 'uppercase',
    color: 'rgba(245, 239, 230, 0.6)',
  },
  modeTabTextActive: {
    color: Colors.obsidian,
    fontFamily: Fonts.monoBold,
  },
  formCard: {
    marginBottom: 24,
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 16,
  },
  errorText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12,
    color: '#FCA5A5',
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 18, 19, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.15)',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 46,
    color: Colors.ivory,
    fontFamily: Fonts.sansRegular,
    fontSize: 14,
  },
  submitButton: {
    marginTop: 8,
  },
  screeningBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(197, 160, 89, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
    gap: 12,
  },
  screeningIcon: {
    marginTop: 2,
  },
  screeningContent: {
    flex: 1,
  },
  screeningTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 16,
    color: Colors.ivory,
    marginBottom: 4,
  },
  screeningDescription: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.7)',
    lineHeight: 16,
    marginBottom: 10,
  },
  screeningLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screeningLinkText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
    textTransform: 'uppercase',
  },
});
