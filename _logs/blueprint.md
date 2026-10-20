# BLUEPRINT — SURJEET SINGH GURUKUL COMPANION MOBILE APP (iOS & ANDROID)

## 1. Executive Summary & Architecture
- **Project Name:** surjeet_singh_mobile (Surjeet Singh Digital Gurukul Companion)
- **Repository:** `https://github.com/SurjeetSinghTabla/surjeet-tabla-academy-mobile.git`
- **Platform:** Cross-platform Native Mobile (iOS & Android)
- **Framework:** React Native with Expo Router (SDK 52+), TypeScript, NativeWind v4
- **Shared Infrastructure:**
  - Supabase Database & Auth (`https://qvqzlzbboczgbzqkubiw.supabase.co`)
  - Sanity.io CMS (`projectId: 72ylykxj`, dataset: `production`)
  - Vercel Web Proxy API (`https://surjeet-tabla-academy.vercel.app` for Razorpay orders & verification)
- **Author Identity:** `SurjeetSinghTabla <surjeettablaacademy@gmail.com>`

## 2. Design System & Visual Tokens
- **Surface & Canvas Colors:**
  - Light Parchment (`parchment`): `#E9E2D6` (Warm aged sitar wood / raw silk)
  - Dark Obsidian (`obsidian`): `#141213` (Video theatre mode, bottom navigation, dark cards)
  - Deep Burgundy (`burgundy`): `#2B090E` (Primary headings & active pills on light surfaces)
  - Sacred Ivory (`ivory`): `#F5EFE6` (Headings on dark surfaces)
  - Antique Gold (`gold`): `#C5A059` (Accents, active tab indicators, Taal badges, borders)
- **Typography:**
  - Display Serif: `CormorantGaramond_600SemiBold`, `CormorantGaramond_400Regular_Italic`
  - UI & Body Sans: `PlusJakartaSans_400Regular`, `PlusJakartaSans_500Medium`, `PlusJakartaSans_700Bold`
  - Bol Syllables & Rhythmic Grids: `JetBrainsMono_500Medium`
- **Apple Frosted Glass Specification (`expo-blur`):**
  - Native hardware-accelerated `BlurView` (`intensity={65}`, `tint="light"` on parchment; `tint="dark"` on obsidian).
  - 1px Specular hairline border (`rgba(255, 255, 255, 0.65)` on light; `rgba(197, 160, 89, 0.28)` on dark).
  - Floating pill-shaped Bottom Tab Bar suspended 24px above safe area.

## 3. Screen Routing Topology (`src/app`)
- `_layout.tsx`: Root Stack, Font Loader, Supabase AuthProvider, Theme Provider
- `(auth)/login.tsx`: Student Sign In & Guru-gated account creation
- `(auth)/register-screening.tsx`: ₹400 Serious-Learner Screening Form & Hosted Audition Link
- `(tabs)/_layout.tsx`: Suspended Apple Frosted Glass Tab Bar
- `(tabs)/index.tsx`: "Gurukul" — Student Home, Active Tier Progress & 3 Tiers Catalog
- `(tabs)/practice.tsx`: "Riyaz Studio" — Interactive Bol Reader & 16-Matra Metronome Pulse
- `(tabs)/masterclass.tsx`: "1-on-1 Sangat" — Live Mentorship Booking & Google Calendar WebView
- `(tabs)/repertoire.tsx`: "Archive" — Surjeet's Concert Recitals & 24-Bit Stem Requests
- `(tabs)/profile.tsx`: "My Account" — Enrolled Tiers, Receipts & Sign Out
- `course/[lessonSlug].tsx`: Fullscreen Lesson Player (`react-native-youtube-iframe`), Bol Notation sheet, Riyaz Counter, PDF Download
