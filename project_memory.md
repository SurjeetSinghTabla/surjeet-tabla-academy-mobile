# Project Memory — Surjeet Singh Gurukul Companion Mobile App

## 1. Project Context & Ecosystem
- **Repository:** `https://github.com/SurjeetSinghTabla/surjeet-tabla-academy-mobile.git`
- **Companion Website:** `https://github.com/SurjeetSinghTabla/surjeet-tabla-academy.git` (`https://surjeet-tabla-academy.vercel.app`)
- **Git Author:** Must always commit and push strictly as `SurjeetSinghTabla <surjeettablaacademy@gmail.com>`.

## 2. Shared Backend Coordinates
- **Supabase PostgreSQL & Auth:** `https://qvqzlzbboczgbzqkubiw.supabase.co`
- **Sanity.io Studio:** Project ID `72ylykxj`, Dataset `production`.
- **Payment Gateway Security Rule:** Never store `RAZORPAY_KEY_SECRET` in the mobile app binary. Mobile checkout hits the website's `/api/razorpay/create-order` and `/api/razorpay/verify` server routes.

## 3. UI/UX & Sensory Architecture
- **Editorial Heritage Palette:**
  - Parchment: `#E9E2D6`
  - Obsidian: `#141213`
  - Deep Burgundy: `#2B090E`
  - Sacred Ivory: `#F5EFE6`
  - Antique Gold: `#C5A059`
- **Apple Frosted Glass:** Built via `expo-blur` (`intensity={65–75}`, `tint="dark"`). The floating bottom tab bar is suspended above the safe area with a 1px specular gold border.
- **Rhythmic Bol Notation:** Styled using `JetBrainsMono_500Medium` with 16-matra Teentaal division into 4 classical Vibhags (Sam `X`, Taali `2`, Khaali `0`, Taali `3`).

## 4. Architectural Decisions & Access Control
- **Expo SDK Version Lock:** Kept strictly at Expo SDK 57 (`57.0.30`) for compatibility with Play Store Expo Go.
- **Curriculum Gating:** Individual playable curriculum lessons must NOT be exposed to guests or unauthenticated users. Unauthenticated visitors see the 3-Step Admission Protocol and high-level curriculum overview. Once logged in, their recommended tier and playable lesson modules unlock.
- **Riyaz Section Scope:** The standalone Riyaz practice tab and lesson-level repetition counters were intentionally retired to streamline the mobile experience to the Gurukul core (Admission, Curriculum, 1-on-1 Mentorship, Archival Works & Disciple Account).
- **Masterclass Topic:** Freeform text input allows students on both Web and Mobile to articulate specific musical compositions, Gharana techniques, or accompaniment challenges.
