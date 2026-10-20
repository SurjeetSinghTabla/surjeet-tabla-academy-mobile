import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  variant?: 'light' | 'dark' | 'goldAccent';
  borderRadius?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 65,
  tint = 'dark',
  variant = 'dark',
  borderRadius = 24,
}: GlassCardProps) {
  const isDark = variant === 'dark' || variant === 'goldAccent';

  const borderColor =
    variant === 'goldAccent'
      ? Colors.gold
      : isDark
      ? Colors.specularDark
      : Colors.specularLight;

  const backgroundColor =
    variant === 'goldAccent'
      ? 'rgba(197, 160, 89, 0.08)'
      : isDark
      ? 'rgba(28, 25, 26, 0.72)'
      : 'rgba(255, 255, 255, 0.75)';

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          borderColor,
          backgroundColor,
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={tint === 'default' ? (isDark ? 'dark' : 'light') : tint}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  content: {
    padding: 16,
  },
});
