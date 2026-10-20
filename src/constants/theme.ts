import { Platform } from 'react-native';

export const Colors = {
  // Heritage Editorial Palette (Mirrors Next.js Web Gurukul)
  parchment: '#E9E2D6',        // Warm aged sitar wood / raw silk
  obsidian: '#141213',         // Dark obsidian Gurukul canvas
  burgundy: '#2B090E',         // Deep classical burgundy heading
  ivory: '#F5EFE6',            // Sacred ivory text on dark surfaces
  gold: '#C5A059',             // Antique brass / Punjab Gharana gold
  goldLight: '#D9B46E',        // Bright gold highlight
  goldMuted: 'rgba(197, 160, 89, 0.18)',

  cardDark: '#1C191A',         // Secondary dark card surface
  cardDarkElevated: '#242022', // Tertiary dark surface
  surfaceLight: '#F2ECE1',     // Slightly elevated light card surface

  emerald: '#10B981',          // Success / verification indicator
  crimson: '#8A1C24',          // Primary action accent on light surfaces
  crimsonLight: '#A32832',

  // Border & Hairlines
  borderLight: 'rgba(43, 9, 14, 0.12)',
  borderDark: 'rgba(245, 239, 230, 0.12)',
  specularLight: 'rgba(255, 255, 255, 0.65)',
  specularDark: 'rgba(197, 160, 89, 0.32)',

  // Semantic Mappings for Dark / Light Modes
  light: {
    background: '#E9E2D6',
    surface: '#F2ECE1',
    card: '#FFFFFF',
    text: '#2B090E',
    textMuted: '#6B5E59',
    accent: '#8A1C24',
    gold: '#C5A059',
    border: 'rgba(43, 9, 14, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.65)',
  },
  dark: {
    background: '#141213',
    surface: '#1C191A',
    card: '#221E20',
    text: '#F5EFE6',
    textMuted: '#A19791',
    accent: '#C5A059',
    gold: '#C5A059',
    border: 'rgba(245, 239, 230, 0.12)',
    glassBorder: 'rgba(197, 160, 89, 0.28)',
  },
} as const;

export const Fonts = {
  // Display Serif (Headings, Guru Quotes, Tier Titles)
  serifSemiBold: 'CormorantGaramond_600SemiBold',
  serifItalic: 'CormorantGaramond_400Regular_Italic',
  serifBold: 'CormorantGaramond_700Bold',

  // UI Sans (Body, buttons, lesson lists, navigation)
  sansRegular: 'PlusJakartaSans_400Regular',
  sansMedium: 'PlusJakartaSans_500Medium',
  sansSemiBold: 'PlusJakartaSans_600SemiBold',
  sansBold: 'PlusJakartaSans_700Bold',

  // Rhythmic Monospace (Bol syllables, Matra counts, timings)
  monoMedium: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 48,
} as const;

export const GlassTokens = {
  borderRadius: 24,
  blurIntensityLight: 70,
  blurIntensityDark: 60,
  tintLight: 'light' as const,
  tintDark: 'dark' as const,
};
