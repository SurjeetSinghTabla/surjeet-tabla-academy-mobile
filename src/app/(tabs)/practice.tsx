import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RotateCcw, Sparkles, BookOpen, Music, CheckCircle } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { TaalPulseRing } from '@/components/ui/TaalPulseRing';

export default function PracticeScreen() {
  const [repetitionCount, setRepetitionCount] = useState<number>(0);
  const [selectedTaalPreset, setSelectedTaalPreset] = useState<'teentaal' | 'jhaptaal' | 'roopak'>('teentaal');

  const thekaLibrary = {
    teentaal: {
      name: 'Teentaal (16 Matras)',
      vibhags: [
        { label: 'Vibhag 1 • Sam [X]', bols: 'Dha   Dhin   Dhin   Dha' },
        { label: 'Vibhag 2 • Taali [2]', bols: 'Dha   Dhin   Dhin   Dha' },
        { label: 'Vibhag 3 • Khaali [0]', bols: 'Dha   Tin    Tin    Ta' },
        { label: 'Vibhag 4 • Taali [3]', bols: 'Ta    Dhin   Dhin   Dha' },
      ],
      guruTip: 'Maintain firm Bayan resonance on Dha and Dhin. Keep the index finger curved precisely on the Kinar rim.',
    },
    jhaptaal: {
      name: 'Jhaptaal (10 Matras: 2-3-2-3)',
      vibhags: [
        { label: 'Vibhag 1 • Sam [X]', bols: 'Dhi   Na' },
        { label: 'Vibhag 2 • Taali [2]', bols: 'Dhi   Dhi   Na' },
        { label: 'Vibhag 3 • Khaali [0]', bols: 'Ti    Na' },
        { label: 'Vibhag 4 • Taali [3]', bols: 'Dhi   Dhi   Na' },
      ],
      guruTip: 'Observe the asymmetry between the two-beat and three-beat vibhags. Crisp Nikas on Ti and Na.',
    },
    roopak: {
      name: 'Roopak Taal (7 Matras: 3-2-2)',
      vibhags: [
        { label: 'Vibhag 1 • Khaali [0]', bols: 'Tin   Tin   Na' },
        { label: 'Vibhag 2 • Taali [1]', bols: 'Dhin  Na' },
        { label: 'Vibhag 3 • Taali [2]', bols: 'Dhin  Na' },
      ],
      guruTip: 'Roopak famously begins with Khaali on the first beat. Count with internal stillness.',
    },
  };

  const activeTheka = thekaLibrary[selectedTaalPreset];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>INTERACTIVE RIYAZ STUDIO</Text>
            <View style={styles.badgeDot} />
          </View>
          <Text style={styles.title}>Practice & Metronome</Text>
          <Text style={styles.subtitle}>
            Rhythmic Taal pulse, matra visualizer, and session repetition counter for daily disciple practice.
          </Text>
        </View>

        {/* Taal Preset Switcher */}
        <View style={styles.presetTabs}>
          {(['teentaal', 'jhaptaal', 'roopak'] as const).map((preset) => (
            <TouchableOpacity
              key={preset}
              onPress={() => setSelectedTaalPreset(preset)}
              style={[
                styles.presetTab,
                selectedTaalPreset === preset && styles.presetTabActive,
              ]}
            >
              <Text
                style={[
                  styles.presetTabText,
                  selectedTaalPreset === preset && styles.presetTabTextActive,
                ]}
              >
                {preset === 'teentaal' ? 'Teentaal (16)' : preset === 'jhaptaal' ? 'Jhaptaal (10)' : 'Roopak (7)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 16-Matra Taal Pulse Ring & Visualizer */}
        <TaalPulseRing taalName={activeTheka.name} defaultBpm={120} />

        {/* Session Repetition Counter Card */}
        <GlassCard variant="dark" intensity={70} style={styles.counterCard}>
          <View style={styles.counterHeader}>
            <View>
              <Text style={styles.counterSub}>SESSION REPETITIONS</Text>
              <Text style={styles.counterTitle}>Kayda / Rela Target</Text>
            </View>

            <TouchableOpacity
              onPress={() => setRepetitionCount(0)}
              style={styles.resetButton}
            >
              <RotateCcw size={16} color="rgba(245, 239, 230, 0.6)" />
            </TouchableOpacity>
          </View>

          <View style={styles.counterDisplay}>
            <Text style={styles.counterNumber}>{repetitionCount}</Text>
            <Text style={styles.counterTarget}>/ 108 Target</Text>
          </View>

          {/* Stepper Buttons */}
          <View style={styles.stepperRow}>
            <TouchableOpacity
              onPress={() => setRepetitionCount((prev) => Math.max(0, prev - 1))}
              style={styles.stepperButton}
            >
              <Text style={styles.stepperButtonText}>-1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRepetitionCount((prev) => prev + 1)}
              style={[styles.stepperButton, styles.stepperButtonPrimary]}
            >
              <Text style={[styles.stepperButtonText, styles.stepperButtonPrimaryText]}>+1 Avartan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRepetitionCount((prev) => prev + 5)}
              style={styles.stepperButton}
            >
              <Text style={styles.stepperButtonText}>+5</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRepetitionCount((prev) => prev + 25)}
              style={styles.stepperButton}
            >
              <Text style={styles.stepperButtonText}>+25</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Theka Bol Syllable Reference */}
        <GlassCard variant="dark" intensity={70} style={styles.thekaCard}>
          <View style={styles.thekaHeader}>
            <BookOpen size={16} color={Colors.gold} />
            <Text style={styles.thekaTitle}>Standard Theka Bols</Text>
          </View>

          <View style={styles.vibhagsList}>
            {activeTheka.vibhags.map((vibhag, idx) => (
              <View key={idx} style={styles.vibhagItem}>
                <Text style={styles.vibhagLabel}>{vibhag.label}</Text>
                <Text style={styles.vibhagBols}>{vibhag.bols}</Text>
              </View>
            ))}
          </View>

          <View style={styles.guruTipBox}>
            <Sparkles size={14} color={Colors.gold} style={{ marginTop: 2 }} />
            <Text style={styles.guruTipText}>{activeTheka.guruTip}</Text>
          </View>
        </GlassCard>
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
  presetTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.08)',
  },
  presetTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  presetTabActive: {
    backgroundColor: Colors.gold,
  },
  presetTabText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.6)',
  },
  presetTabTextActive: {
    color: Colors.obsidian,
    fontFamily: Fonts.monoBold,
  },
  counterCard: {
    marginBottom: 16,
  },
  counterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  counterSub: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 1,
  },
  counterTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
  },
  resetButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  counterDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: 12,
  },
  counterNumber: {
    fontFamily: Fonts.monoBold,
    fontSize: 48,
    color: Colors.gold,
  },
  counterTarget: {
    fontFamily: Fonts.monoMedium,
    fontSize: 14,
    color: 'rgba(245, 239, 230, 0.45)',
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepperButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonPrimary: {
    backgroundColor: Colors.gold,
    borderColor: Colors.goldLight,
    flex: 1.5,
  },
  stepperButtonText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: Colors.ivory,
  },
  stepperButtonPrimaryText: {
    color: Colors.obsidian,
    fontFamily: Fonts.monoBold,
  },
  thekaCard: {
    marginBottom: 16,
  },
  thekaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  thekaTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
  },
  vibhagsList: {
    gap: 10,
    marginBottom: 14,
  },
  vibhagItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.06)',
  },
  vibhagLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 9,
    color: Colors.gold,
    letterSpacing: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  vibhagBols: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    color: Colors.ivory,
    letterSpacing: 0.5,
  },
  guruTipBox: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 239, 230, 0.08)',
  },
  guruTipText: {
    flex: 1,
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.6)',
    lineHeight: 16,
  },
});
