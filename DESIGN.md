# Design System — Archit Konde Portfolio

## Product Context
- **What this is:** Personal portfolio and technical blog for a Machine Learning Engineer
- **Who it's for:** Hiring managers, technical recruiters, and fellow engineers evaluating Archit's work
- **Space/industry:** Developer portfolios, technical personal sites
- **Project type:** Static site (HTML/CSS/vanilla JS), PWA-enabled, GitHub Pages

## Aesthetic Direction
- **Direction:** Retro-Futuristic / IDE-inspired — the site presents as a VS Code terminal session
- **Decoration level:** Intentional — macOS traffic-light dots, terminal prompts, blinking cursors, ghost command animations. Decoration serves the terminal metaphor, never purely ornamental.
- **Mood:** Technical credibility with warmth. The amber gold accent prevents the dark theme from feeling cold or generic. The terminal metaphor signals "I live in code" without being gimmicky.
- **Reference:** VS Code Dark+ color theme

## Typography
- **All roles:** JetBrains Mono — monospace everywhere, no role differentiation. The single-font approach reinforces the terminal identity.
- **Fallback chain:** Fira Code, Cascadia Code, Courier New, monospace
- **Loading:** Google Fonts — `family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400`
- **Scale:**
  - Hero name: `2.6rem` (desktop), `2rem` (tablet), `1.7rem` (mobile)
  - Section body text: `0.88rem`
  - Card title: `0.88rem` weight 600
  - Card description: `0.78rem`
  - Navigation: `0.78rem`
  - Tags/badges: `0.72rem`
  - Card links: `0.68rem`
  - Smallest text (status): `0.65rem`
- **Base font size:** `16px` (html root), reduced to `15px` at 768px

## Color
- **Approach:** Restrained — one accent color, neutrals do the heavy lifting
- **Palette (CSS custom properties):**
  - `--bg: #1e1e1e` — VS Code editor background (page background)
  - `--surface: #252526` — VS Code sidebar (cards, panels, terminal body)
  - `--border: #3e3e42` — VS Code borders (dividers, card borders, muted UI)
  - `--text: #d4d4d4` — VS Code default text (primary body text)
  - `--muted: #858585` — VS Code comments (secondary text, labels, hints)
  - `--accent: #C9A84C` — amber gold (links, highlights, prompts, interactive elements)
- **Semantic colors (hardcoded, not in custom properties):**
  - Success/live: `#28c840` (terminal green — status dot, open-to-work indicator)
  - Close: `#ff5f57` (macOS red dot)
  - Minimize: `#febc2e` (macOS yellow dot)
  - Maximize: `#28c840` (macOS green dot)
- **Selection:** `background: var(--accent); color: var(--bg)` — amber on dark
- **Dark mode:** The site IS dark mode. No light mode variant exists.
- **Print mode:** Full light theme override — `--bg: #ffffff`, `--text: #1a1a1a`, `--accent: #95782a` (darker amber for paper legibility)
- **Matrix easter egg:** `--bg: #000`, `--text: #00ff41`, `--accent: #00ff41` (green-on-black CRT effect)

## Spacing
- **Base unit:** `0.4rem` (~6px) — doubling scale
- **Density:** Comfortable — generous section padding, tight card interiors
- **Scale (CSS custom properties):**
  - `--s1: 0.4rem` (~6px) — tight gaps, tag padding
  - `--s2: 0.8rem` (~12px) — card inner gaps, small margins
  - `--s3: 1.6rem` (~24px) — section body padding, card padding, grid gaps
  - `--s4: 3.2rem` (~48px) — section header margin-bottom, large gaps
  - `--s5: 6.4rem` (~96px) — section vertical padding
- **Navbar height:** `60px` (`--nav-h`)
- **Max content width:** `880px` (`--max-w`)

## Layout
- **Approach:** Grid-disciplined with horizontal scroll for collections
- **Content container:** max-width `880px`, centered, horizontal padding `--s3`
- **Project/blog cards:** Horizontal flex scroll with snap (`min-width: 300px`, `max-width: 360px`)
- **About section:** 2-column grid (`3fr 1.4fr`), stacks to 1 column at 768px
- **Experience section:** 2-column grid (`100px 1fr`), stacks at 768px
- **Border radius:** Minimal — `8px` on terminal window, `2px` on tags, `3px` on scrollbar thumb. No rounded corners on cards.
- **Breakpoints:** 768px (tablet — nav collapses, grids stack), 480px (phone — font size reduction)

## Motion
- **Approach:** Intentional — animation serves the terminal metaphor
- **Default transition:** `0.2s ease` (`--ease`)
- **Animations:**
  - Typewriter effect: 45ms per character on tagline
  - Ghost commands: 65ms typing, 28ms erasing, 1400ms hold
  - Cursor blink: `1s step-end infinite`
  - Status dot pulse: `2s ease infinite`
  - Scroll hint float: `2.5s ease-in-out infinite`
  - Fade-in on scroll: `0.45s ease` (via IntersectionObserver, once per element)
  - Terminal window transitions: `0.4s cubic-bezier(0.16, 1, 0.3, 1)`
- **Reduced motion:** Full `prefers-reduced-motion: reduce` support — all animations disabled

## Interactive Elements
- **Terminal window:** macOS-style chrome with functional close/minimize/maximize buttons
- **Command palette:** VS Code-style `Ctrl+K`/`Cmd+K` overlay with fuzzy search
- **Keyboard shortcuts:** Single-key navigation (H, A, E, S, P, G, B, C, R, T, Space, ?, /)
- **Easter eggs:** "archit", "help", "matrix", "boom" command palette entries; "exit 0" shutdown overlay; man page overlay
- **Card overlays:** Full-card clickable via positioned anchor + JS click forwarding
- **Content protection:** Right-click and DevTools shortcut blocking (obfuscation, not security)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03 | JetBrains Mono everywhere | Single monospace font reinforces terminal metaphor across all text |
| 2026-03 | No border-radius on cards | Sharp edges match the IDE/terminal aesthetic; rounded corners would soften it |
| 2026-03 | Horizontal scroll for projects/blog | Avoids stacking 5 cards vertically; matches modern portfolio patterns |
| 2026-03 | Amber gold accent (#C9A84C) | Warm neutral that avoids the blue/purple developer site cliche |
| 2026-03 | user-select: none on body | Terminal windows don't allow text selection; selectable code/inputs explicitly re-enabled |
| 2026-03 | Doubling spacing scale (0.4rem) | Provides consistent visual rhythm; every spacing value is a power of the base |
| 2026-03-24 | Design system documented | Extracted from existing CSS into DESIGN.md by /design-consultation |
