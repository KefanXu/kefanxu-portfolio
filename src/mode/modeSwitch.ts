/*
 * Mode switch shared by both versions of the site.
 *
 *   research → the academic portfolio served from `/`
 *   design   → the product-design portfolio served from `/design/`
 *
 * Each mode is a separate HTML entry with its own global styles, so switching
 * is a real navigation. A curtain covers the outgoing page, the browser loads
 * the other entry, and the same curtain lifts on arrival so the change reads as
 * one continuous gesture. The module is framework-free on purpose: it owns its
 * own DOM and never touches either React tree.
 */
import './mode-switch.css';

export type SiteMode = 'research' | 'design';

const HANDOFF_KEY = 'kx-mode-handoff';
const HANDOFF_MAX_AGE = 8000;
const COVER_MS = 760;
const MIN_COVERED_MS = 420;

const LABELS: Record<SiteMode, { short: string; caption: string }> = {
  research: { short: 'Researcher', caption: 'Researcher mode' },
  design: { short: 'Designer', caption: 'Designer mode' },
};

function modeUrl(mode: SiteMode) {
  const base = import.meta.env.BASE_URL;
  return mode === 'design' ? `${base}design/` : base;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readHandoff(current: SiteMode) {
  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return false;
    sessionStorage.removeItem(HANDOFF_KEY);
    const { to, at } = JSON.parse(raw) as { to: SiteMode; at: number };
    return to === current && Date.now() - at < HANDOFF_MAX_AGE;
  } catch {
    return false;
  }
}

function buildCurtain(to: SiteMode) {
  const curtain = document.createElement('div');
  curtain.className = 'kx-curtain';
  curtain.dataset.to = to;
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = `
    <div class="kx-curtain__inner">
      <svg class="kx-curtain__mark" viewBox="0 0 64 64" width="64" height="64" fill="none">
        <circle cx="32" cy="32" r="29" stroke="currentColor" stroke-width="1.5" />
        <path d="M32 3a29 29 0 0 1 0 58Z" fill="currentColor" />
      </svg>
      <span class="kx-curtain__caption">${LABELS[to].caption}</span>
    </div>`;
  return curtain;
}

/** Resolves once the arrival curtain (if any) has started to lift. */
let arrival: Promise<void> = Promise.resolve();
export function whenModeRevealed() {
  return arrival;
}

let depart: ((target: SiteMode, href: string) => void) | null = null;
/**
 * Leave for the other mode through the same curtain the pill uses, optionally
 * to a deep link such as `/#project/pecss`. Falls back to plain navigation.
 */
export function goToMode(target: SiteMode, href = modeUrl(target)) {
  if (depart && !prefersReducedMotion()) depart(target, href);
  else window.location.href = href;
}

export function mountModeSwitch(current: SiteMode) {
  if (document.querySelector('.kx-mode')) return;
  const other: SiteMode = current === 'design' ? 'research' : 'design';
  const root = document.documentElement;

  /* ── Arrival: finish the gesture started on the other page ───────────── */
  const arriving = readHandoff(current) && !prefersReducedMotion();
  if (arriving) {
    const curtain = buildCurtain(current);
    curtain.classList.add('is-covering');
    document.body.appendChild(curtain);
    const coveredAt = performance.now();

    arrival = new Promise<void>(resolve => {
      let lifted = false;
      const lift = () => {
        if (lifted) return;
        lifted = true;
        const wait = Math.max(0, MIN_COVERED_MS - (performance.now() - coveredAt));
        window.setTimeout(() => {
          root.classList.remove('kx-arriving');
          curtain.classList.remove('is-covering');
          curtain.classList.add('is-out');
          resolve();
          window.setTimeout(() => curtain.remove(), 1100);
        }, wait);
      };
      const fonts = document.fonts?.ready ?? Promise.resolve();
      const loaded = new Promise<void>(done => {
        if (document.readyState === 'complete') done();
        else window.addEventListener('load', () => done(), { once: true });
      });
      Promise.all([fonts, loaded]).then(lift);
      window.setTimeout(lift, 1600);
    });
  } else {
    root.classList.remove('kx-arriving');
  }

  /* ── The pill ────────────────────────────────────────────────────────── */
  const nav = document.createElement('nav');
  nav.className = 'kx-mode';
  nav.dataset.mode = current;
  nav.setAttribute('aria-label', 'Portfolio mode');
  nav.innerHTML = `
    <div class="kx-mode__track">
      <span class="kx-mode__thumb" aria-hidden="true"></span>
      <a class="kx-mode__opt" data-target="research" href="${modeUrl('research')}">${LABELS.research.short}</a>
      <a class="kx-mode__opt" data-target="design" href="${modeUrl('design')}">${LABELS.design.short}</a>
    </div>`;
  document.body.appendChild(nav);

  const thumb = nav.querySelector<HTMLElement>('.kx-mode__thumb')!;
  const options = Array.from(nav.querySelectorAll<HTMLAnchorElement>('.kx-mode__opt'));
  const optionFor = (mode: SiteMode) => options.find(option => option.dataset.target === mode)!;

  let selected: SiteMode = current;
  const placeThumb = (animate: boolean) => {
    const target = optionFor(selected);
    if (!animate) thumb.style.transition = 'none';
    thumb.style.width = `${target.offsetWidth}px`;
    thumb.style.transform = `translateX(${target.offsetLeft}px)`;
    if (!animate) {
      void thumb.offsetWidth;
      thumb.style.transition = '';
    }
    options.forEach(option => {
      const active = option.dataset.target === selected;
      option.classList.toggle('is-active', active);
      if (active && option.dataset.target === current) option.setAttribute('aria-current', 'page');
      else option.removeAttribute('aria-current');
    });
  };
  placeThumb(false);
  document.fonts?.ready.then(() => placeThumb(false));
  window.addEventListener('resize', () => placeThumb(false), { passive: true });

  /* Warm the other entry as soon as someone shows interest in it. */
  let prefetched = false;
  const prefetch = () => {
    if (prefetched) return;
    prefetched = true;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = modeUrl(other);
    document.head.appendChild(link);
  };
  optionFor(other).addEventListener('pointerenter', prefetch, { passive: true });
  optionFor(other).addEventListener('focus', prefetch);

  /* ── Departure ───────────────────────────────────────────────────────── */
  let leaving = false;
  depart = (target, href) => {
    if (leaving || target === current) return;
    leaving = true;
    nav.classList.remove('is-tucked');
    selected = target;
    placeThumb(true);
    try {
      sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ to: target, at: Date.now() }));
    } catch {
      /* storage unavailable: the destination simply loads without a curtain */
    }

    const curtain = buildCurtain(target);
    document.body.appendChild(curtain);
    void curtain.offsetWidth;
    window.setTimeout(() => curtain.classList.add('is-in'), 140);
    window.setTimeout(() => {
      window.location.href = href;
    }, 140 + COVER_MS + 60);
  };

  nav.addEventListener('click', event => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('.kx-mode__opt');
    if (!link) return;
    const target = link.dataset.target as SiteMode;
    if (target === current) {
      event.preventDefault();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (prefersReducedMotion()) return; // plain navigation
    event.preventDefault();
    depart?.(target, link.href);
  });

  /* A page restored from the back/forward cache must not stay covered. */
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    document.querySelectorAll('.kx-curtain').forEach(node => node.remove());
    leaving = false;
    selected = current;
    placeThumb(false);
  });

  /* Step aside while someone is reading down the page; return on the way up. */
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        const delta = y - lastY;
        if (Math.abs(delta) < 6) return;
        const nearEnd = window.innerHeight + y > document.documentElement.scrollHeight - 160;
        nav.classList.toggle('is-tucked', delta > 0 && y > 320 && !nearEnd);
        lastY = y;
      });
    },
    { passive: true },
  );
  nav.addEventListener('focusin', () => nav.classList.remove('is-tucked'));
}
