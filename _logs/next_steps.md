# Next Steps — Surjeet Singh Gurukul Companion Mobile App

## Active Phase
- Milestone 1 Complete: Full Scaffolding, Apple Frosted Glass Design System, Shared Backend Integration & Lesson Player

## Master Plan Checklist
- [x] Create standalone repository directory `surjeet_singh_mobile`
- [x] Initialize Git repository tracking `https://github.com/SurjeetSinghTabla/surjeet-tabla-academy-mobile.git` with author `SurjeetSinghTabla <surjeettablaacademy@gmail.com>`
- [x] Install project dependencies:
  - `expo-blur`, `expo-secure-store`, `lucide-react-native`, `react-native-svg`
  - `@supabase/supabase-js`, `@react-native-async-storage/async-storage`, `@sanity/client`
  - `react-native-youtube-iframe`, `react-native-webview`
  - `@expo-google-fonts/cormorant-garamond`, `@expo-google-fonts/plus-jakarta-sans`, `@expo-google-fonts/jetbrains-mono`
- [x] Configure `src/constants/theme.ts` with Parchment, Obsidian, Burgundy, Ivory, and Gold tokens
- [x] Configure `.env` with shared Supabase, Sanity, and Web API keys
- [x] Build reusable UI primitives:
  - `<GlassCard />` (Hardware-accelerated Apple frosted glass via `expo-blur`)
  - `<GlassButton />` (Gold/Burgundy interactive frosted button)
  - `<TaalPulseRing />` (16-beat Teentaal matra visualizer with Vilambit/Drut tempo control)
  - `<FloatingTabBar />` (Apple VisionOS suspended frosted navigation pill)
- [x] Build Backend Clients:
  - `src/lib/supabase.ts` (with AsyncStorage session persistence & real-time profile listener)
  - `src/lib/sanity.ts` (GROQ queries for lessons, works, and site settings)
  - `src/lib/youtube.ts` (Universal 11-char ID extractor supporting all formats)
- [x] Implement Root Layout & Theme/Auth Provider (`src/app/_layout.tsx`)
- [x] Implement Auth Screens:
  - `src/app/(auth)/login.tsx` (Sign in & Guru-gated account unlock)
  - `src/app/(auth)/register-screening.tsx` (₹400 screening audition form)
- [x] Implement Main Tab Screens:
  - `src/app/(tabs)/_layout.tsx` (Floating bottom tab navigation)
  - `src/app/(tabs)/index.tsx` (Gurukul Home & 3 Tiers Catalog)
  - `src/app/(tabs)/practice.tsx` (Riyaz Studio & 16-Matra Metronome)
  - `src/app/(tabs)/masterclass.tsx` (1-on-1 Masterclass Booking & Calendar WebView)
  - `src/app/(tabs)/repertoire.tsx` (Concert Archive & 24-Bit Stems)
  - `src/app/(tabs)/profile.tsx` (Student Profile & Unlocked Tiers)
- [x] Implement Lesson Player:
  - `src/app/course/[lessonSlug].tsx` (YouTube video player, Bol Notation, PDF attachments, Riyaz count)
- [x] Run TypeScript verification (`tsc --noEmit` passing with 0 errors)
- [ ] Connect Razorpay native mobile SDK when production merchant keys are issued
- [ ] Build standalone iOS & Android production binaries via EAS (`eas build`)
