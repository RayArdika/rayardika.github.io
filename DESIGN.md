# DESIGN.md - Ray Ardika Raihan Portfolio (Studiova Editorial Direction)

## 1. Brand Identity & Direction
- **Owner:** Ray Ardika Raihan (Full-Stack Web Developer, Laravel & Next.js)
- **Visual Reference:** Studiova Agency & Business Template (WrapPixel / 21st.dev v2) adapted into a personal engineering portfolio with CMS administration.
- **Design Read:** Reading this as: personal software engineering portfolio and case-study showcase for hiring managers, technical leads, and project clients, in a Studiova high-contrast editorial language, dial `ENERGY 3 / RHYTHM 3 / MOTION 2`.

## 2. Three Liveliness Dials
- **ENERGY: 3 (Bold)** - Full-viewport architectural dark hero with oversized display typography (`Ray Ardika.`), top 4px electric lime accent border (`#C1FF72`), and high-contrast section transitions.
- **RHYTHM: 3 (Asymmetric, Mixed Compositions)** - Every section uses Studiova's asymmetric 4-column index marker (`01` to `08` + horizontal rule + dark category pill) paired with an 8-column content canvas that alternates between typographic metrics (`01`), horizontal interactive project showcase (`02`), split-pane interactive tabs on dark slate (`03`), timeline + education cards (`04`), filterable project archive (`05`), credential grid (`06`), flush accordion (`07`), and minimal bottom-border contact form (`08`).
- **MOTION: 2 (Scroll-reveal & Purposeful Transitions)** - Staggered scroll-reveal on section entry, rotating geometric asterisk motif in the header/hero, and Studiova's signature sliding pill button where text shifts right while the circular arrow badge slides from right to left and rotates 45 degrees on hover/focus. Respects `prefers-reduced-motion`.

## 3. Color Palette & Contrast Verification (R-01, R-25, R-29)
Limited to 3 core neutrals + 1 deliberate accent (`#C1FF72`):
- **Core Dark (`#1F2A2E` / `#12191C` in dark theme):** Deep architectural slate used for the hero, capabilities section (`03`), footer, and primary headings on light surfaces.
- **Core Light (`#FFFFFF`) & Secondary Surface (`#F4F8FA`):** Clean editorial paper surfaces alternating to separate narrative blocks.
- **Body Text Muted (`#4A5459` on light, `#C2CDD2` on dark):**
  - `#1F2A2E` on `#FFFFFF` = **14.70:1** (WCAG AAA)
  - `#1F2A2E` on `#F4F8FA` = **13.75:1** (WCAG AAA)
  - `#4A5459` on `#FFFFFF` = **7.77:1** (WCAG AAA)
  - `#4A5459` on `#F4F8FA` = **7.27:1** (WCAG AAA)
  - `#C2CDD2` on `#1F2A2E` = **9.07:1** (WCAG AAA)
  - `#1F2A2E` on `#C1FF72` = **12.47:1** (WCAG AAA)
- **Deliberate Accent (`#C1FF72` - Electric Lime):** Used strictly for the top 4px frame border, section index circles (`01`-`08`), primary interactive CTA pills, and active tab highlights.

## 4. Typography (R-06)
- **Primary Typeface:** `Manrope` (200-800 weight), matching the Studiova reference template. Chosen for its geometric humanist proportions and crisp numerals at large display sizes (`fs-16` / `clamp(3.25rem, 8vw, 6.5rem)`).
- **Monospace Typeface:** `JetBrains Mono` used only for technical metadata (stack tags, dates, and CMS/OAuth config snippets).

## 5. Written Reasons for Visual Decisions (R-31)
- **Palette (`#1F2A2E`, `#F4F8FA`, `#C1FF72`):** Preserves the exact Studiova editorial contrast between deep slate and electric lime while meeting >7:1 WCAG AA/AAA contrast across both light and dark themes.
- **Asymmetric 4/8 Grid & Numbered Markers (`01`-`08`):** Acts as the repeated identity motif from Studiova, giving technical recruiters an immediate left-hand index while scanning long-form engineering work.
- **Typography (`Manrope`):** Matches the Studiova template's geometric display headings and keeps dense operational project descriptions legible on mobile and desktop.
- **Spacing Scale:** Alternates generous desktop vertical rhythm (`py-16 lg:py-28`) with compact mobile spacing (`py-12`) so mobile viewports never scroll through empty gaps.
- **Cards & Surface Variation:** Used only where items represent distinct entities (projects, credentials, education) with varied internal layouts instead of identical icon-card grids.
- **Button Arrow (`↗`):** Reserved exclusively for primary Studiova sliding action buttons and external/modal triggers to signal navigation or dialog launch.
- **No Unverified Claims (R-17, R-18, R-36, R-38):** Fictional agency testimonials, fake team members, and arbitrary pricing tiers from the raw template are replaced with Ray's real CV data (Projects, Featured Projects, Experience, Education, Certifications) managed via Decap CMS. Missing project screenshots use honest `[PREVIEW SCREENSHOT BELUM DIUNGGAH]` placeholders until uploaded in `/admin`.

