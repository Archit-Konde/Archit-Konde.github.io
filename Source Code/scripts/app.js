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
  const isBlog = window.location.pathname.includes('/blog/');
  const is404 = window.location.pathname.includes('404.html');
  const isHome = !isBlog && !is404;

  const baseCommands = [
    { icon: '🏠', label: 'Go to Home', hint: '[H]', action() { window.location.href = isHome ? '#' : '/index.html'; } },
    { icon: '↗', label: 'View SupportOps Demo', hint: 'HuggingFace', action() { window.open('https://architechs-supportops-ai-monitor.hf.space', '_blank'); } },
    { icon: './', label: 'View GitHub', hint: 'github.com', action() { window.open('https://github.com/Archit-Konde', '_blank'); } },
    { icon: 'in', label: 'View LinkedIn', hint: 'linkedin.com', action() { window.open('https://www.linkedin.com/in/architkonde/', '_blank'); } },
  ];

  const homeCommands = [
    { icon: '→', label: 'Jump to About', hint: '[A]', action() { scrollTo('#about'); } },
    { icon: '→', label: 'Jump to Experience', hint: '[E]', action() { scrollTo('#experience'); } },
    { icon: '→', label: 'Jump to Skills', hint: '[S]', action() { scrollTo('#skills'); } },
    { icon: '→', label: 'Jump to Projects', hint: '[P]', action() { scrollTo('#projects'); } },
    { icon: '→', label: 'Jump to Blog', hint: '[B]', action() { scrollTo('#blog'); } },
    { icon: '→', label: 'Jump to Contact', hint: '[C]', action() { scrollTo('#contact'); } },
  ];

  const blogCommands = [
    { icon: '📝', label: 'Read: SupportOps AI Monitor', hint: '[B] Post', action() { window.location.href = isBlog ? 'supportops-ai-monitor.html' : '/pages/blog/supportops-ai-monitor.html'; } },
    { icon: '←', label: 'Back to Blog List', hint: 'Home #blog', action() { window.location.href = '/index.html#blog'; } },
  ];

  let currentCommands = [...baseCommands];
  if (isHome) currentCommands = [...homeCommands, ...blogCommands, ...baseCommands];
  else if (isBlog) currentCommands = [...blogCommands, ...baseCommands];
  else currentCommands = [...baseCommands];

  function scrollTo(sel) {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  const palette = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-input');
  const list = document.getElementById('cmd-list');
  if (!palette || !input || !list) return;

  let activeIdx = 0;
  let filtered = currentCommands.slice();

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

      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        cmd.action();
        close();
      });

      li.addEventListener('mouseenter', () => {
        activeIdx = i;
        const items = list.querySelectorAll('.cmd-item');
        items.forEach((item, idx) => {
          item.classList.toggle('active', idx === i);
        });
      });
      list.appendChild(li);
    });
  }

  function open() {
    palette.hidden = false;
    input.value = '';
    filtered = currentCommands.slice();
    activeIdx = 0;
    render();
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    palette.hidden = true;
    input.value = '';
  }

  // Handle global shortcuts with a sequence buffer
  let keyBuffer = '';
  let keyTimer = null;

  document.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in an input or textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Ignore modifier keys alone
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

    const key = e.key.toLowerCase();
    keyBuffer += key;

    if (keyTimer) clearTimeout(keyTimer);

    keyTimer = setTimeout(() => {
      const sequence = keyBuffer;
      keyBuffer = ''; // reset

      // 1. Check for specific word sequences (Easter Eggs)
      if (sequence === 'archit') {
        console.log("%cArchit Protocol Activated", "color: #C9A84C; font-size: 16px; font-weight: bold;");
        open();
        input.value = 'archit';
        input.dispatchEvent(new Event('input'));
        return;
      }

      if (sequence === 'help') {
        open();
        input.value = 'help';
        input.dispatchEvent(new Event('input'));
        return;
      }

      if (sequence === 'matrix') {
        document.body.classList.toggle('matrix-theme');
        return;
      }

      // 2. Handle single-key shortcuts
      if (sequence.length === 1) {
        const shortcuts = {
          'h': () => window.location.href = isHome ? '#' : '/index.html',
          'a': () => scrollTo('#about'),
          'e': () => scrollTo('#experience'),
          's': () => scrollTo('#skills'),
          'p': () => scrollTo('#projects'),
          'b': () => isHome ? scrollTo('#blog') : window.location.href = '/index.html#blog',
          'c': () => scrollTo('#contact'),
          'r': () => window.open('/docs/resume.pdf', '_blank'),
          't': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
          ' ': (event) => { if (event) event.preventDefault(); palette.hidden ? open() : close(); }
        };
        if (shortcuts[sequence]) shortcuts[sequence](e);
      }
    }, 400); // 400ms buffer to recognize typing vs single-key
  });

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

    /* ── Easter Eggs ── */
    const qLower = q.toLowerCase();

    if (qLower === 'sudo') {
      filtered = [{ icon: '🔒', label: 'Nice try. Permission denied.', hint: 'you are not root', action() { } }];
      activeIdx = 0;
      render();
      return;
    }

    if (qLower === 'help') {
      filtered = [
        { icon: '❓', label: 'SYSTEM CMD: List Shortcuts', hint: 'show-key-map', action() { alert('Shortcuts:\nH: Home, A: About, E: Exp, S: Skills, P: Proj, B: Blog, C: Contact, R: Resume, T: Top, Space: Menu'); } },
        { icon: '💾', label: 'SYSTEM CMD: Clear Cache', hint: 'sw-reset', action() { navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())); window.location.reload(); } },
        { icon: '🕶️', label: 'SYSTEM CMD: Toggle Matrix Mode', hint: 'theme-override', action() { document.body.classList.toggle('matrix-theme'); } },
      ];
      activeIdx = 0;
      render();
      return;
    }

    if (qLower === 'archit') {
      filtered = [{
        icon: '👑',
        label: 'Lead ML Engineer / Researcher',
        hint: 'creator',
        action() {
          console.log(`%c
   ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄ ▄▄▄▄▄▄▄ 
  █       █       █       █   █       █
  █   ▄   █   ▄▄▄▄█       █   █▄     ▄█
  █  █▄█  █  █▄▄▄▄█     ▄▄█   █ █   █  
  █       █    ▄▄▄█    █  █   █ █   █  
  █   ▄   █   █▄▄▄█    █▄▄█   █ █   █  
  █▄▄█ █▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄▄█ █▄▄▄█  
  `, "color: #C9A84C; font-weight: bold;");
          alert('Built with focus and precision. - Archit');
        }
      }];
      activeIdx = 0;
      render();
      return;
    }

    if (qLower === 'matrix') {
      filtered = [{ icon: '💊', label: 'Follow the white rabbit...', hint: 'toggle-theme', action() { document.body.classList.toggle('matrix-theme'); close(); } }];
      activeIdx = 0;
      render();
      return;
    }

    if (qLower === 'boom') {
      filtered = [{ icon: '💥', label: 'Self destruct in 3... 2... 1...', hint: 'rm -rf /', action() { document.body.style.filter = 'invert(1) blur(10px)'; setTimeout(() => window.location.reload(), 1000); } }];
      activeIdx = 0;
      render();
      return;
    }

    filtered = q
      ? currentCommands.filter(c => fuzzyMatch(q, c.label) || fuzzyMatch(q, c.hint))
      : currentCommands.slice();
    activeIdx = 0;
    render();
  });

  input.addEventListener('keydown', (e) => {
    const len = filtered.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = (activeIdx + 1) % Math.max(len, 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = (activeIdx - 1 + len) % Math.max(len, 1);
      render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIdx]) { filtered[activeIdx].action(); close(); }
    } else if (e.key === 'Escape') {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      e.stopImmediatePropagation();
      palette.hidden ? open() : close();
    }
  }, { capture: true });

  const backdrop = palette.querySelector('.cmd-backdrop');
  if (backdrop) backdrop.addEventListener('click', close);

  const floatBtn = document.getElementById('cmd-pal-btn');
  if (floatBtn) {
    floatBtn.addEventListener('click', () => {
      palette.hidden ? open() : close();
    });
  }
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

/* ── 10. CONTENT PROTECTION (Right-click / Selection / Inspector) ── */
(function protectContent() {
  const isDevAllowed = (el) => el && el.closest && el.closest('input, textarea, code, pre, .selectable');

  // Multi-layer right-click blocking (Capture phase)
  window.addEventListener('contextmenu', (e) => {
    if (isDevAllowed(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);

  // Comprehensive shortcut blocking (Win/Linux/Mac)
  window.addEventListener('keydown', (e) => {
    const { key, keyCode, ctrlKey, shiftKey, metaKey, altKey } = e;
    const isMod = ctrlKey || metaKey; // Ctrl on Win, Cmd on Mac

    // F12
    if (key === 'F12' || keyCode === 123) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    // Mod + U (View Source)
    if (isMod && (key === 'u' || keyCode === 85)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    // Mod + Shift + I  OR  Mod + Alt + I (Inspector)
    if (isMod && (key === 'i' || key === 'I' || keyCode === 73) && (shiftKey || altKey)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    // Mod + Shift + J  OR  Mod + Alt + J (Console)
    if (isMod && (key === 'j' || key === 'J' || keyCode === 74) && (shiftKey || altKey)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    // Mod + Shift + C  OR  Mod + Alt + C (Picker)
    if (isMod && (key === 'c' || key === 'C' || keyCode === 67) && (shiftKey || altKey)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    // Mod + S (Save Page)
    if (isMod && (key === 's' || keyCode === 83)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  // Anti-Debugging: Pauses execution if DevTools are open
  // This is a common deterrent
  const antiDebug = () => {
    const start = new Date();
    debugger;
    const end = new Date();
    if (end - start > 100) {
      // If it took longer than 100ms, a debugger (DevTools) is likely active
      window.location.reload();
    }
  };

  // Run anti-debug periodically
  setInterval(antiDebug, 2000);
})();

/* ── 11. TERMINAL WINDOW CONTROLLER (Traffic Light Buttons) ───── */
(function terminalController() {
  const windowEl = document.querySelector('.term-window');
  const heroEl = document.getElementById('home');
  const restoreBtn = document.getElementById('restore-term');
  const dots = {
    red: document.querySelector('.dot-r'),
    yellow: document.querySelector('.dot-y'),
    green: document.querySelector('.dot-g')
  };

  if (!windowEl) return;

  // 1. Red Dot (Close)
  dots.red?.addEventListener('click', () => {
    windowEl.classList.add('is-closed');
    heroEl?.classList.add('window-gone');

    // Log system event
    console.log('%c[system] process terminated: terminal.exe exited with code 0', 'color:#858585; font-style:italic;');
  });

  // 2. Yellow Dot (Minimize)
  dots.yellow?.addEventListener('click', () => {
    windowEl.classList.add('is-minimized');
    heroEl?.classList.add('window-minimized');
    console.log('%c[system] process moved to background: terminal.exe', 'color:#858585;');
  });

  // 3. Green Dot (Maximize/Fullscreen)
  dots.green?.addEventListener('click', () => {
    windowEl.classList.toggle('is-maximized');

    // If maximizing, ensure it's not minimized
    if (windowEl.classList.contains('is-maximized')) {
      windowEl.classList.remove('is-minimized');
      heroEl?.classList.remove('window-minimized');
    }
  });

  // 4. Restore Logic
  restoreBtn?.addEventListener('click', () => {
    windowEl.classList.remove('is-closed', 'is-minimized', 'is-maximized');
    heroEl?.classList.remove('window-gone', 'window-minimized');

    // Visual "re-boot" effect
    windowEl.style.opacity = '0';
    setTimeout(() => {
      windowEl.style.opacity = '1';
      console.log('%c[system] process initiated: terminal.exe', 'color:#28c840; font-weight:bold;');
    }, 50);
  });

  // Close with Esc if maximized
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && windowEl.classList.contains('is-maximized')) {
      windowEl.classList.remove('is-maximized');
    }
  });
})();
