# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static portfolio and technical blog for a Machine Learning Engineer, hosted on GitHub Pages. Terminal-inspired dark theme, vanilla JS (no frameworks), PWA-enabled.

**Live site:** https://archit-konde.github.io/

## Build & Development

There is no package manager or build toolchain. The site is plain HTML/CSS/JS.

**Minify assets** (after editing CSS or JS):
```bash
python3 minify_assets.py
```
This reads `Source Code/styles/main.css` → `main.min.css` and `Source Code/scripts/app.js` → `app.min.js`.

**Deployment:** Automatic via GitHub Actions on push to `main` when `Source Code/**` or `docs/**` change. The workflow copies `docs/` into `Source Code/` then deploys `Source Code/` to GitHub Pages.

**No tests or linter configured.**

## Repository Structure

```
minify_assets.py       ← Minifies CSS/JS (run from repo root)
.nojekyll              ← Disables Jekyll on GitHub Pages
Source Code/           ← Deployed site root
  index.html           ← Main page (single-page layout)
  404.html             ← Offline/error fallback
  sitemap.xml          ← SEO sitemap
  styles/main.css      ← All styles (edit this, then minify)
  scripts/app.js       ← All JS logic (edit this, then minify)
  sw.js                ← Service Worker (bump CACHE_VERSION on asset changes)
  manifest.json        ← PWA manifest
  pages/blog/          ← Blog post HTML files
  assets/icons/        ← SVG PWA icons
.github/workflows/
  deploy.yml           ← GitHub Pages deployment workflow
docs/
  SPECIFICATION.md     ← Detailed technical architecture spec
  resume.pdf
```

## Key Architecture Details

- **Single CSS file** (`main.css`): Uses CSS custom properties for theming. Color palette is VS Code Dark+ inspired (`--bg: #1e1e1e`, `--accent: #C9A84C`). Spacing uses a doubling scale (`--s1` through `--s5`).
- **Single JS file** (`app.js`): Modules include typewriter effect, navbar scroll detection, active nav link (IntersectionObserver), mobile menu toggle, fade-in animations, command palette (`Ctrl+K`/`Cmd+K`).
- **Service Worker** (`sw.js`): Cache-first for static assets, network-first for navigation. The `CACHE_VERSION` constant must be incremented when cached assets change.
- **No Jekyll:** `.nojekyll` file disables Jekyll processing on GitHub Pages.
- **PWA:** Installable via manifest.json and service worker.

## Dual Licensing

- **MIT License** → source code in `Source Code/`
- **CC BY 4.0** → blog content in `Source Code/pages/blog/`

## Design System

Read `DESIGN.md` before making any visual or UI decisions. All font choices, colors, spacing, and aesthetic direction are defined there. Do not deviate without explicit user approval.

## Important Conventions

- After editing `main.css` or `app.js`, always regenerate the `.min` files by running `python3 minify_assets.py`.
- When changing any cached asset, bump `CACHE_VERSION` in `sw.js`.
- Blog posts are standalone HTML files in `Source Code/pages/blog/`. Each must include: `<meta name="description">`, Open Graph tags (`og:type`, `og:url`, `og:title`, `og:description`), Twitter Card tags, and a `<link rel="canonical">` URL.
- The `Source Code/` directory name contains a space — use quotes in shell commands.
