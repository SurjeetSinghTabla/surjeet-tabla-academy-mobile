import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Fonts } from '@/constants/theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'gold' | 'burgundy' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function GlassButton({
  title,
  onPress,
  variant = 'gold',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: GlassButtonProps) {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'gold':
        return {
          backgroundColor: Colors.gold,
          borderColor: Colors.goldLight,
        };
      case 'burgundy':
        return {
          backgroundColor: Colors.burgundy,
          borderColor: 'rgba(255, 255, 255, 0.15)',
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(28, 25, 26, 0.65)',
          borderColor: Colors.gold,
        };
      case 'danger':
        return {
          backgroundColor: 'rgba(138, 28, 36, 0.15)',
          borderColor: 'rgba(239, 68, 68, 0.4)',
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'gold':
        return Colors.obsidian;
      case 'burgundy':
        return Colors.ivory;
      case 'glass':
        return Colors.gold;
      case 'danger':
        return '#EF4444';
    }
  };

  const getSizeStyle = (): { paddingVertical: number; paddingHorizontal: number; fontSize: number } => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 14, fontSize: 11 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, fontSize: 13 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 18, fontSize: 12 };
    }
  };

  const sizeMetrics = getSizeStyle();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getContainerStyle(),
        {
          paddingVertical: sizeMetrics.paddingVertical,
          paddingHorizontal: sizeMetrics.paddingHorizontal,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {variant === 'glass' && (
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
      )}

      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.innerContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: sizeMetrics.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    marginRight: 2,
  },
  text: {
    fontFamily: Fonts.monoMedium,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
});
