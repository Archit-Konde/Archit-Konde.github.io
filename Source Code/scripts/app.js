/* ═══════════════════════════════════════════════════════════════
   ARCHIT KONDE — PORTFOLIO  |  script.js

   What this file does (in order):
     1. TYPEWRITER  — animates the tagline character by character
     2. NAVBAR      — adds .scrolled class when user scrolls down
     3. ACTIVE NAV  — highlights the current section's nav link
     4. MOBILE MENU — hamburger toggle open/close
     5. FADE-IN     — reveals section-bodies as they enter viewport
     6. FOOTER YEAR — inserts the current year automatically
     7. CONSOLE MSG — easter egg for developers who open DevTools
     8. CMD PALETTE — VS Code-style Ctrl+K quick navigation
     9. ACCESSIBILITY — keyboard focus management and ARIA updates

   Learning note:
     All of this is plain JavaScript — no frameworks, no libraries.
     We use the DOM API (document.querySelector, etc.) to select
     HTML elements and modify them at runtime.

   ARCHITECTURAL NOTES:
     - Event Delegation: Performance optimized via single listener patterns where applicable.
     - Intersection Observer: Utilized for lazy-triggering animations to minimize CPU idle impact.
     - Memory Management: IIFEs used to encapsulate logic and prevent global namespace pollution.
═══════════════════════════════════════════════════════════════ */


/* ── 0. DEVELOPER CONSOLE EASTER EGG ─────────────────────────
   When another developer opens DevTools on this site, they'll
   see styled terminal-like messages in the console.

   %c in console.log() lets you pass CSS as the second argument,
   styling the text that follows it — like coloring terminal output.
──────────────────────────────────────────────────────────────── */

(function devConsole() {
  const gold = 'color:#C9A84C; font-family:monospace; font-weight:bold;';
  const grey = 'color:#858585; font-family:monospace;';
  const white = 'color:#d4d4d4; font-family:monospace;';
  const green = 'color:#28c840; font-family:monospace; font-weight:bold;';
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

const TAGLINE = 'solving intelligence, one step at a time.';
const TWEl = document.getElementById('tw-text');      // the text span
const TWCursor = document.getElementById('tw-cursor');    // the █ cursor span
const TYPE_SPEED = 45;  // milliseconds between each character

function typeWriter(text, el, speed) {
  let i = 0;

  // Hide the block cursor while typing is in progress
  if (TWCursor) TWCursor.style.display = 'none';

  const interval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i++];  // append next character
    } else {
      clearInterval(interval);           // stop the timer
      if (TWCursor) TWCursor.style.display = 'inline'; // show cursor
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

const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (navbar) navbar.classList.toggle('scrolled', y > 50);
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
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const matchingLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      // Only update active state when the section has a nav link.
      // Sections like #education have no nav entry — skip them
      // so the previously-active link stays highlighted.
      if (matchingLink) {
        navLinks.forEach(link => link.classList.remove('nav-active'));
        matchingLink.classList.add('nav-active');
      }
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

const hamburger = document.getElementById('hamburger');
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


/* ── 7. GHOST COMMANDS ANIMATION ─────────────────────────────
   Cycles through fake terminal commands on the idle prompt line,
   typing each one out then erasing it — giving the terminal a
   "live" feel rather than a static blinking cursor.

   Flow:
     wait for typewriter to finish (≈ 3.2s from page load)
       │
       └─ pick next command from GHOST_CMDS
             │
             ├─ type it char by char (65ms per char)
             │
             ├─ pause at full command (1400ms)
             │
             ├─ erase char by char (28ms per char — faster than typing)
             │
             └─ pause (600ms), then loop with next command

   Skipped entirely if the visitor prefers reduced motion.
──────────────────────────────────────────────────────────────── */

const ghostEl = document.getElementById('ghost-text');

const GHOST_CMDS = [
  ' ls -la models/',
  ' git log --oneline',
  ' python train.py --epochs ∞',
  ' nvidia-smi',
  ' python -c "import torch"',
  ' cat README.md',
  ' git diff HEAD~1 --stat',
  ' python -c "import torch; torch.cuda.is_available()"',
];

let ghostIdx = 0;

function ghostLoop() {
  if (!ghostEl) return;

  const cmd = GHOST_CMDS[ghostIdx % GHOST_CMDS.length];
  ghostIdx++;

  let i = 0;

  // Type the command character by character
  const typer = setInterval(() => {
    if (i < cmd.length) {
      ghostEl.textContent += cmd[i++];
    } else {
      clearInterval(typer);
      // Hold at full command, then erase
      setTimeout(() => {
        const eraser = setInterval(() => {
          const t = ghostEl.textContent;
          if (t.length > 0) {
            ghostEl.textContent = t.slice(0, -1);  // remove last char
          } else {
            clearInterval(eraser);
            setTimeout(ghostLoop, 600);             // pause, then next command
          }
        }, 28);   // erase faster than typing for snappy feel
      }, 1400);   // pause at full command before erasing
    }
  }, 65);         // ms per character while typing
}

// Start after the typewriter finishes (700ms boot delay + ~45ms × 41 chars ≈ 2550ms total)
// We wait 3200ms to give a comfortable gap.
// Guard: skip if user has prefers-reduced-motion set.
if (ghostEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setTimeout(ghostLoop, 3200);
}


/* ── 8. COMMAND PALETTE ──────────────────────────────────────
   VS Code-style Ctrl+K / Cmd+K overlay for quick navigation.
   Same pattern as the landing page command palette.
──────────────────────────────────────────────────────────────── */

(function commandPalette() {
  const COMMANDS = [
    { icon: '→', label: 'Go to About', hint: '#about', action() { scrollTo('#about'); } },
    { icon: '→', label: 'Go to Experience', hint: '#experience', action() { scrollTo('#experience'); } },
    { icon: '→', label: 'Go to Skills', hint: '#skills', action() { scrollTo('#skills'); } },
    { icon: '→', label: 'Go to Projects', hint: '#projects', action() { scrollTo('#projects'); } },
    { icon: '→', label: 'Go to Blog', hint: '#blog', action() { scrollTo('#blog'); } },
    { icon: '→', label: 'Go to Contact', hint: '#contact', action() { scrollTo('#contact'); } },
    { icon: '↗', label: 'View SupportOps Demo', hint: 'HuggingFace', action() { window.open('https://architechs-supportops-ai-monitor.hf.space', '_blank'); } },
    { icon: './', label: 'View GitHub', hint: 'github.com', action() { window.open('https://github.com/Archit-Konde', '_blank'); } },
    { icon: 'in', label: 'View LinkedIn', hint: 'linkedin.com', action() { window.open('https://www.linkedin.com/in/architkonde/', '_blank'); } },
  ];

  function scrollTo(sel) {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  const palette = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-input');
  const list = document.getElementById('cmd-list');
  if (!palette || !input || !list) return;

  let activeIdx = 0;
  let filtered = COMMANDS.slice();

  function render() {
    list.innerHTML = '';
    filtered.forEach((cmd, i) => {
      const li = document.createElement('li');
      li.className = 'cmd-item' + (i === activeIdx ? ' active' : '');
      li.setAttribute('role', 'option');
      li.innerHTML =
        `<span class="cmd-item-icon">${cmd.icon}</span>` +
        `<span class="cmd-item-label">${cmd.label}</span>` +
        `<span class="cmd-item-hint">${cmd.hint}</span>`;
      li.addEventListener('click', () => { cmd.action(); close(); });
      li.addEventListener('mouseenter', () => { activeIdx = i; render(); });
      list.appendChild(li);
    });
  }

  function open() {
    palette.hidden = false;
    input.value = '';
    filtered = COMMANDS.slice();
    activeIdx = 0;
    render();
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    palette.hidden = true;
    input.value = '';
  }

  function fuzzyMatch(query, text) {
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    let qi = 0;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) qi++;
    }
    return qi === q.length;
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();

    /* Easter egg: sudo */
    if (q.toLowerCase() === 'sudo') {
      filtered = [{ icon: '🔒', label: 'Nice try. Permission denied.', hint: 'you are not root', action() { } }];
      activeIdx = 0;
      render();
      return;
    }

    filtered = q
      ? COMMANDS.filter(c => fuzzyMatch(q, c.label) || fuzzyMatch(q, c.hint))
      : COMMANDS.slice();
    activeIdx = 0;
    render();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = (activeIdx + 1) % Math.max(filtered.length, 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = (activeIdx - 1 + filtered.length) % Math.max(filtered.length, 1);
      render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIdx]) { filtered[activeIdx].action(); close(); }
    } else if (e.key === 'Escape') {
      close();
    }
  });

  /* Ctrl+K / Cmd+K toggle */
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      palette.hidden ? open() : close();
    }
  });

  /* Backdrop click to close */
  palette.querySelector('.cmd-backdrop').addEventListener('click', close);

  /* Nav bar kbd trigger */
  const kbdBtn = document.getElementById('nav-kbd-trigger');
  if (kbdBtn) kbdBtn.addEventListener('click', open);
})();


/* ── 9. CLICKABLE CARD OVERLAYS ──────────────────────────────
   Each .project-card that contains a .card-overlay-link is made
   fully clickable. The overlay anchor handles right-click context
   menus (CSS: position:absolute; inset:0; display:block).
   Left-clicks are forwarded here via JS for cross-browser reliability —
   some browsers don't treat an empty positioned <a> as a hit target.

   Clicks on real nested <a> or <button> elements bubble naturally
   to their own handlers and are NOT intercepted.
──────────────────────────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  const overlay = card.querySelector('.card-overlay-link');
  if (!overlay) return;

  card.addEventListener('click', e => {
    // Let real nested links and buttons handle their own clicks
    if (e.target.closest('a, button')) return;
    // Open the overlay destination
    if (overlay.target === '_blank' || e.ctrlKey || e.metaKey) {
      window.open(overlay.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = overlay.href;
    }
  });
});
