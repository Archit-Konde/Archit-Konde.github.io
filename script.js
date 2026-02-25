/* ═══════════════════════════════════════════════════════════════
   ARCHIT KONDE — PORTFOLIO  |  script.js

   What this file does (in order):
     1. TYPEWRITER  — animates the tagline character by character
     2. NAVBAR      — adds .scrolled class when user scrolls down
     3. ACTIVE NAV  — highlights the current section's nav link
     4. MOBILE MENU — hamburger toggle open/close
     5. FADE-IN     — reveals section-bodies as they enter viewport
     6. FOOTER YEAR — inserts the current year automatically
   7. CONSOLE MSG  — easter egg for developers who open DevTools

   Learning note:
     All of this is plain JavaScript — no frameworks, no libraries.
     We use the DOM API (document.querySelector, etc.) to select
     HTML elements and modify them at runtime.
═══════════════════════════════════════════════════════════════ */


/* ── 0. DEVELOPER CONSOLE EASTER EGG ─────────────────────────
   When another developer opens DevTools on this site, they'll
   see styled terminal-like messages in the console.

   %c in console.log() lets you pass CSS as the second argument,
   styling the text that follows it — like coloring terminal output.
──────────────────────────────────────────────────────────────── */

(function devConsole() {
  const gold   = 'color:#C9A84C; font-family:monospace; font-weight:bold;';
  const grey   = 'color:#858585; font-family:monospace;';
  const white  = 'color:#d4d4d4; font-family:monospace;';
  const green  = 'color:#28c840; font-family:monospace; font-weight:bold;';
  const divider = 'color:#3e3e42; font-family:monospace;';

  console.log('%c> archit@portfolio:~$', gold);
  console.log('%c─────────────────────────────────────────────────', divider);
  console.log('%c  Hey fellow dev 👋  You found the console.', white);
  console.log('%c  Respect for looking under the hood.', grey);
  console.log('%c─────────────────────────────────────────────────', divider);
  console.log('%c  Stack  →  HTML + CSS + Vanilla JS', grey);
  console.log('%c  Font   →  JetBrains Mono (Google Fonts)', grey);
  console.log('%c  Host   →  GitHub Pages (zero cost, full control)', grey);
  console.log('%c  Repo   →  github.com/Archit-Konde/Archit-Konde.github.io', gold);
  console.log('%c─────────────────────────────────────────────────', divider);
  console.log('%c  ● Open to ML/AI roles — architkonde19@gmail.com', green);
  console.log('%c─────────────────────────────────────────────────', divider);
})();
// The (function(){ ... })() pattern is an IIFE — Immediately Invoked Function
// Expression. It runs once immediately and keeps variables scoped inside it,
// so they don't pollute the global window object.


/* ── 1. TYPEWRITER EFFECT ─────────────────────────────────────
   How it works:
     - We store the full tagline string.
     - setInterval fires a callback every TYPE_SPEED milliseconds.
     - Each call appends one more character to the element.
     - When done, we show the blinking block cursor (█).

   Flow diagram:
     page load
        │
        └─ wait 700ms (feels like terminal "booting")
              │
              └─ typeWriter() starts
                    │
                    ├─ every 45ms: add one character
                    │
                    └─ when complete: show █ cursor
──────────────────────────────────────────────────────────────── */

const TAGLINE    = 'solving intelligence, one step at a time.';
const TWEl       = document.getElementById('tw-text');      // the text span
const TWCursor   = document.getElementById('tw-cursor');    // the █ cursor span
const TYPE_SPEED = 45;  // milliseconds between each character

function typeWriter(text, el, speed, onDone) {
  let i = 0;

  // Hide the block cursor while typing is in progress
  if (TWCursor) TWCursor.style.display = 'none';

  const interval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];  // append next character
      i++;
    } else {
      clearInterval(interval);           // stop the timer
      if (TWCursor) TWCursor.style.display = 'inline'; // show cursor
      if (onDone) onDone();              // optional callback
    }
  }, speed);
}

// DOMContentLoaded fires when the HTML is fully parsed
// (safer than window.onload which waits for images too)
document.addEventListener('DOMContentLoaded', () => {
  if (TWEl) {
    setTimeout(() => {
      typeWriter(TAGLINE, TWEl, TYPE_SPEED);
    }, 700);  // 700ms boot delay
  }

  // ── Also set the footer copyright year automatically ──
  // This way you never have to manually update it each year.
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});


/* ── 2. NAVBAR SCROLL + BACK-TO-TOP ──────────────────────────
   One scroll listener handles both behaviours to avoid firing
   two separate event handlers on every scroll tick.

   navbar:      adds .scrolled after 50px  → CSS darkens the border
   backToTop:   adds .visible after 400px  → CSS fades the button in
──────────────────────────────────────────────────────────────── */

const navbar    = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (navbar)    navbar.classList.toggle('scrolled', y > 50);
  if (backToTop) backToTop.classList.toggle('visible', y > 400);
});

/* Clicking the button smoothly scrolls to the very top.
   { behavior: 'smooth' } is the same smooth-scroll as CSS
   scroll-behavior: smooth, but triggered from JS.            */
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── 3. ACTIVE NAV LINK (Intersection Observer) ───────────────
   We want the nav link to light up in amber when its section
   is currently visible on screen.

   IntersectionObserver watches multiple elements and fires a
   callback whenever one enters or leaves the viewport.

   Flow:
     user scrolls
        │
        └─ observer detects section entering viewport
              │
              └─ removes .nav-active from all links
                    │
                    └─ adds .nav-active to matching link
──────────────────────────────────────────────────────────────── */

const allSections = document.querySelectorAll('section[id]');
const navLinks    = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove active class from every nav link
      navLinks.forEach(link => link.classList.remove('nav-active'));

      // Find the nav link whose href matches the section's id
      const id = entry.target.id;
      const matchingLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (matchingLink) matchingLink.classList.add('nav-active');
    }
  });
}, {
  threshold: 0.35,              // section must be 35% visible to trigger
  rootMargin: '-60px 0px 0px 0px'  // offset for the fixed navbar height
});

allSections.forEach(section => sectionObserver.observe(section));


/* ── 4. MOBILE MENU TOGGLE ────────────────────────────────────
   The hamburger button toggles the full-screen menu overlay.
   Clicking any link inside the menu closes it.
   We also toggle aria-expanded / aria-hidden for accessibility.
──────────────────────────────────────────────────────────────── */

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = document.querySelectorAll('.mob-link');

function openMenu() {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';  // prevent background scroll
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

mobileClose?.addEventListener('click', closeMenu);

// Close menu when any nav link is clicked
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Close menu if user presses Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
});


/* ── 5. SERVICE WORKER REGISTRATION ──────────────────────────
   Registers sw.js so the browser installs the service worker.
   We check 'serviceWorker' in navigator first because older
   browsers don't support it — this keeps the site working for
   everyone, with offline support only where it's available.

   Why inside DOMContentLoaded? The SW registration is non-blocking,
   but waiting for DOM parse means the page renders first and the
   SW setup happens quietly in the background.
──────────────────────────────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => console.log('%c  ✓ Service Worker registered', 'color:#28c840; font-family:monospace;'))
      .catch(err => console.warn('Service Worker registration failed:', err));
  });
}


/* ── 6. SCROLL FADE-IN ANIMATION ─────────────────────────────
   Each .section-body fades up into view as it enters the screen.
   This uses a second IntersectionObserver.

   When a section-body enters the viewport:
     1. Add the .fade-up CSS class (triggers the animation)
     2. Stop observing that element (we only animate it once)
──────────────────────────────────────────────────────────────── */

const fadeEls = document.querySelectorAll('.section-body');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-up');
      fadeObserver.unobserve(entry.target);  // animate only once
    }
  });
}, { threshold: 0.1 });  // trigger when just 10% of element is visible

fadeEls.forEach(el => fadeObserver.observe(el));
