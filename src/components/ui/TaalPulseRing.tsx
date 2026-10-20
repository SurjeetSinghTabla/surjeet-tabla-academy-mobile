import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, RotateCcw, Volume2, Music } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/theme';
import { GlassCard } from './GlassCard';

interface TaalPulseRingProps {
  taalName?: string;
  defaultBpm?: number;
}

export function TaalPulseRing({
  taalName = 'Teentaal (16 Matras)',
  defaultBpm = 120,
}: TaalPulseRingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMatra, setCurrentMatra] = useState(1);
  const [bpm, setBpm] = useState(defaultBpm);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / bpm) * 1000;
      timerRef.current = setInterval(() => {
        setCurrentMatra((prev) => (prev % 16) + 1);
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentMatra(1);
  };

  // Teentaal Vibhag classification:
  // Matras 1-4: Vibhag 1 (Sam 'X' at 1)
  // Matras 5-8: Vibhag 2 (Taali '2' at 5)
  // Matras 9-12: Vibhag 3 (Khaali '0' at 9)
  // Matras 13-16: Vibhag 4 (Taali '3' at 13)
  const getMatraNotation = (matra: number) => {
    if (matra === 1) return 'X';
    if (matra === 5) return '2';
    if (matra === 9) return '0';
    if (matra === 13) return '3';
    return '';
  };

  return (
    <GlassCard variant="goldAccent" intensity={70} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Music color={Colors.gold} size={16} />
          <Text style={styles.taalTitle}>{taalName}</Text>
        </View>

        <View style={styles.currentMatraBadge}>
          <Text style={styles.currentMatraLabel}>MATRA</Text>
          <Text style={styles.currentMatraNumber}>{currentMatra}</Text>
          <Text style={styles.currentMatraSymbol}>
            {getMatraNotation(currentMatra) ? `(${getMatraNotation(currentMatra)})` : ''}
          </Text>
        </View>
      </View>

      {/* 16-Matra Visual Grid divided into 4 classical Vibhags */}
      <View style={styles.gridContainer}>
        {[0, 1, 2, 3].map((vibhagIndex) => (
          <View key={vibhagIndex} style={styles.vibhagRow}>
            {[1, 2, 3, 4].map((step) => {
              const matraNumber = vibhagIndex * 4 + step;
              const isActive = currentMatra === matraNumber;
              const notation = getMatraNotation(matraNumber);
              const isSam = matraNumber === 1;

              return (
                <View
                  key={matraNumber}
                  style={[
                    styles.matraCell,
                    isActive && styles.matraCellActive,
                    isSam && !isActive && styles.matraCellSam,
                  ]}
                >
                  <Text
                    style={[
                      styles.matraText,
                      isActive && styles.matraTextActive,
                      isSam && !isActive && styles.matraTextSam,
                    ]}
                  >
                    {matraNumber}
                  </Text>
                  {notation ? (
                    <Text
                      style={[
                        styles.notationText,
                        isActive && styles.notationTextActive,
                      ]}
                    >
                      {notation}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Tempo Controls & Playback */}
      <View style={styles.controlsRow}>
        <View style={styles.tempoButtons}>
          <TouchableOpacity
            onPress={() => setBpm(60)}
            style={[styles.bpmPill, bpm === 60 && styles.bpmPillActive]}
          >
            <Text style={[styles.bpmPillText, bpm === 60 && styles.bpmPillTextActive]}>
              Vilambit (60)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setBpm(120)}
            style={[styles.bpmPill, bpm === 120 && styles.bpmPillActive]}
          >
            <Text style={[styles.bpmPillText, bpm === 120 && styles.bpmPillTextActive]}>
              Madhya (120)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setBpm(200)}
            style={[styles.bpmPill, bpm === 200 && styles.bpmPillActive]}
          >
            <Text style={[styles.bpmPillText, bpm === 200 && styles.bpmPillTextActive]}>
              Drut (200)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => setIsPlaying(!isPlaying)}
            style={styles.playButton}
          >
            {isPlaying ? (
              <Pause color={Colors.obsidian} size={18} />
            ) : (
              <Play color={Colors.obsidian} size={18} fill={Colors.obsidian} />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <RotateCcw color={Colors.gold} size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taalTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
  },
  currentMatraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
    marginLeft: 'auto',
  },
  currentMatraLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 9,
    color: Colors.gold,
    letterSpacing: 1,
  },
  currentMatraNumber: {
    fontFamily: Fonts.monoBold,
    fontSize: 16,
    color: Colors.ivory,
  },
  currentMatraSymbol: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: Colors.gold,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 16,
  },
  vibhagRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  matraCell: {
    flex: 1,
    aspectRatio: 0.85,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matraCellActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.goldLight,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  matraCellSam: {
    borderColor: 'rgba(197, 160, 89, 0.4)',
    backgroundColor: 'rgba(197, 160, 89, 0.08)',
  },
  matraText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.ivory,
    opacity: 0.7,
  },
  matraTextActive: {
    color: Colors.obsidian,
    fontFamily: Fonts.monoBold,
    opacity: 1,
  },
  matraTextSam: {
    color: Colors.gold,
    fontFamily: Fonts.monoBold,
    opacity: 1,
  },
  notationText: {
    fontFamily: Fonts.monoBold,
    fontSize: 9,
    color: Colors.gold,
    marginTop: 2,
  },
  notationTextActive: {
    color: Colors.obsidian,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 239, 230, 0.08)',
  },
  tempoButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  bpmPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.1)',
  },
  bpmPillActive: {
    backgroundColor: 'rgba(197, 160, 89, 0.2)',
    borderColor: Colors.gold,
  },
  bpmPillText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: 'rgba(245, 239, 230, 0.6)',
  },
  bpmPillTextActive: {
    color: Colors.gold,
    fontFamily: Fonts.monoBold,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.2)',
  },
});
