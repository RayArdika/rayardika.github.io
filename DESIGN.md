# DESIGN.md - Ray Ardika Raihan Portfolio (Warm Minimalist Engineering Direction)

## 1. Brand Identity & Direction
- **Owner:** Ray Ardika Raihan (Full-Stack Web Developer & AI Researcher)
- **Visual Reference:** Inspired by `albertirgi.com` using the ATM framework (Amati, Tiru, Modifikasi).
- **Core Philosophy:** Clean, crafted, warm editorial software engineering portfolio. Tactile paper tones, zero AI-slop cliches, calm confidence, high tactile micro-interactions, and real operational systems.
- **Design Read:** Personal engineering portfolio and case-study showcase for engineering leads, startup founders, and technical clients. Dial setting: `ENERGY 2 / RHYTHM 2 / MOTION 2`.

## 2. Three Liveliness Dials
- **ENERGY: 2 (Refined, Focused)**: Calm, warm neutral canvas (`#ECECE9`) paired with pure white cards (`#FFFFFF`), deep warm ink (`#262510`), and a deliberate green status dot (`#2F9E5B`).
- **RHYTHM: 2 (Orderly, Consistent Baseline)**: Clear, progressive hierarchy from Hero & live clock, to Manifesto chips, Featured Projects with browser window frames, Experience timeline with status badges, Verified Certifications, and direct Contact footer.
- **MOTION: 2 (Purposeful Transitions)**: Real-time clock pulse, interactive code typing card (`ray.ts`), magnetic interactive buttons, smooth filter pill switches, and modal case-study transitions. All motion strictly honors `prefers-reduced-motion`.

## 3. Color Palette & Contrast Verification (R-16, R-28)
- **Page Background (`#ECECE9`):** Tactile warm paper/sand off-white tone.
- **Card Background (`#FFFFFF` & `#F6F6F3`):** Clean content surfaces with border line `#E6E5DF`.
- **Primary Ink Text (`#262510`):** Warm olive-charcoal text.
  - `#262510` on `#ECECE9` = **13.10:1** (WCAG AAA)
  - `#262510` on `#FFFFFF` = **15.50:1** (WCAG AAA)
- **Muted Text (`#57564C`):**
  - `#57564C` on `#ECECE9` = **6.25:1** (WCAG AA)
  - `#57564C` on `#FFFFFF` = **7.39:1** (WCAG AAA)
- **Primary Button (`#1C1C1A`):**
  - `#FFFFFF` text on `#1C1C1A` = **17.07:1** (WCAG AAA)
- **Accent Indicator (`#2F9E5B` / `#1B6339` for text):**
  - `#1B6339` on `#ECECE9` = **6.14:1** (WCAG AA)

## 4. Typography (R-04)
- **Primary Sans:** `Plus Jakarta Sans` with `Inter` fallback. Clean geometric humanist sans with tight display tracking.
- **Monospace:** `JetBrains Mono` for metadata tags, code block (`ray.ts`), live clock numerals, and technical specs.

## 5. Written Reasons for Visual Decisions (R-31)
- **R-04 (Typography):** Selected `Plus Jakarta Sans` for humanist clarity on screens without generic neo-grotesque blandness.
- **R-07 / R-25 (Layout & Hierarchy):** Centered constrained container (`max-width: 1080px`) with generous breathing room (`py-16 md:py-24`) matching the artisanal feel of Albert Irgi's portfolio.
- **R-17 / R-18 (Interactive UX & Focus States):** Visible high-contrast keyboard `:focus-visible` ring (`2px solid #262510`, offset `2px`), live clock GMT+7, copy-to-clipboard email feedback, and full accessibility labels.
- **R-22 / R-23 (Honest Data):** All projects, metrics (e.g. 81.8% IoU, 67.1% Dice, TOEIC 685, 3.86 GPA), and role descriptions reflect Ray Ardika Raihan's authentic track record.
