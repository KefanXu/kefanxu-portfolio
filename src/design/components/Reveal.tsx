import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { onScrollFrame } from '../lib/scroll';

/*
 * Scroll reveals. One IntersectionObserver marks elements `.is-in`; CSS does
 * the rest (see styles/base.css). A gate lets the app hold reveals while a
 * curtain or page wipe is still covering the viewport, so entrances are seen.
 */
let gateOpen = false;
const waiting = new Set<Element>();
let observer: IntersectionObserver | null = null;

/*
 * An entrance should carry its picture with it. Pictures are asked for early:
 * once an element is within two screens of the viewport its lazy images are
 * switched to eager, so they are usually decoded by the time it reveals. If
 * one is still on its way when the element scrolls into view, the reveal waits
 * a beat for it and then plays anyway; the frame comes in on time and the
 * picture fades in when it lands (lib/images.ts marks it loaded).
 */
const IMAGE_WAIT_MS = 360;
const WARM_SCREENS = 2;
/** A clipped piece opens once its top has come this far up the viewport. */
const CLIP_LINE = 0.85;
/** …and what is inside it keeps settling, scroll-linked, until its top is this far up (see --in in styles/base.css). */
const SETTLE_LINE = 0.4;
function warmImages(element: Element) {
  element.querySelectorAll('img').forEach(img => { if (img.loading === 'lazy') img.loading = 'eager'; });
}
function imagesReady(element: Element): Promise<void> | null {
  const pending = Array.from(element.querySelectorAll('img')).filter(img => !(img.complete && img.naturalWidth > 0));
  if (!pending.length) return null;
  warmImages(element);
  const decoded = Promise.all(pending.map(img => img.decode().catch(() => undefined))).then(() => undefined);
  const cap = new Promise<void>(resolve => window.setTimeout(resolve, IMAGE_WAIT_MS));
  return Promise.race([decoded, cap]);
}
let warmObserver: IntersectionObserver | null = null;
function getWarmObserver() {
  if (warmObserver) return warmObserver;
  warmObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        warmObserver!.unobserve(entry.target);
        warmImages(entry.target);
      });
    },
    { rootMargin: `${WARM_SCREENS * 100}% 0px ${WARM_SCREENS * 100}% 0px`, threshold: 0 },
  );
  return warmObserver;
}

function show(element: Element) {
  if (!gateOpen) { waiting.add(element); return; }
  const ready = imagesReady(element);
  if (ready) void ready.then(() => element.classList.add('is-in'));
  else element.classList.add('is-in');
}
function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer!.unobserve(entry.target);
        show(entry.target);
      });
    },
    { rootMargin: '0px 0px -9% 0px', threshold: 0.01 },
  );
  return observer;
}
export function setRevealGate(open: boolean) {
  gateOpen = open;
  if (!open) return;
  const queued = Array.from(waiting);
  waiting.clear();
  queued.forEach(show);
}

/** Marks the element `.is-in` once it scrolls into view; style the entrance in CSS. */
export function useRevealRef<T extends Element>(clipped = false) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Chromium applies an element's own clip-path when it computes intersections,
    // so a fully clipped element never reports as visible. Clip reveals are
    // tracked by their layout box on the shared scroll loop instead, with an
    // observer on the (unclipped) parent as a second pair of eyes for the
    // moments the loop is not running, such as a tab that loaded in the background.
    if (clipped) {
      let warmed = false;
      let done = false;
      let settled = -1;
      const fire = () => {
        if (done) return;
        done = true;
        io?.disconnect();
        show(element);
      };
      // Stays subscribed: besides the one-off reveal it writes --in, how far the
      // piece has travelled from the bottom edge to the reading zone, so the
      // picture inside can settle with the scroll at any scrolling speed.
      const stop = onScrollFrame(({ vh }) => {
        const rect = element.getBoundingClientRect();
        if (!warmed && rect.top < vh * (1 + WARM_SCREENS)) { warmed = true; warmImages(element); }
        const travel = Math.min(1, Math.max(0, (vh - rect.top) / (vh * (1 - SETTLE_LINE))));
        const rounded = Math.round(travel * 200) / 200;
        if (rounded !== settled) { settled = rounded; (element as unknown as HTMLElement).style.setProperty('--in', rounded.toFixed(3)); }
        if (done || rect.bottom <= 0 || rect.top >= vh * CLIP_LINE) return;
        fire();
      });
      const host = element.parentElement;
      const io = host && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) fire(); }, { rootMargin: `0px 0px -${Math.round((1 - CLIP_LINE) * 100)}% 0px`, threshold: 0 })
        : null;
      io?.observe(host as Element);
      return () => {
        stop();
        io?.disconnect();
        waiting.delete(element);
      };
    }

    const io = getObserver();
    io.observe(element);
    const warm = element.querySelector('img[loading="lazy"]') ? getWarmObserver() : null;
    warm?.observe(element);
    return () => {
      io.unobserve(element);
      warm?.unobserve(element);
      waiting.delete(element);
    };
  }, [clipped]);
  return ref;
}

type Tag = 'div' | 'section' | 'article' | 'figure' | 'li' | 'p' | 'span' | 'header' | 'footer' | 'ul' | 'ol' | 'dl' | 'a' | 'h2' | 'h3' | 'h4';

interface RevealProps {
  as?: Tag;
  kind?: 'up' | 'fade' | 'scale' | 'clip';
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [attribute: string]: unknown;
}
export function Reveal({ as = 'div', kind = 'up', delay = 0, className, style, children, ...rest }: RevealProps) {
  const ref = useRevealRef<HTMLElement>(kind === 'clip');
  return createElement(
    as,
    { ref, className, 'data-reveal': kind, style: { ...style, '--d': `${delay}ms` } as CSSProperties, ...rest },
    children,
  );
}

interface SplitTextProps {
  /** Words wrapped in *asterisks* are set in the italic serif. */
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  delay?: number;
  id?: string;
}
export function SplitText({ text, as = 'p', className = '', delay = 0, id }: SplitTextProps) {
  const ref = useRevealRef<HTMLElement>();
  let emphasised = false;
  const words = text.split(/\s+/).filter(Boolean).map(token => {
    let word = token;
    let italic = emphasised;
    if (word.startsWith('*')) { italic = true; emphasised = true; word = word.slice(1); }
    if (/\*[.,;:!?—–-]*$/.test(word)) { emphasised = false; word = word.replace('*', ''); }
    return { word, italic };
  });
  const plain = words.map(item => item.word).join(' ');

  return createElement(
    as,
    { ref, id, className: `split ${className}`.trim(), style: { '--d': `${delay}ms` } as CSSProperties },
    <span className="sr-only" key="sr">{plain}</span>,
    words.map((item, index) => (
      <span key={index} aria-hidden="true">
        <span className="split__word">
          <span style={{ '--i': index } as CSSProperties}>{item.italic ? <em>{item.word}</em> : item.word}</span>
        </span>
        {index < words.length - 1 ? ' ' : null}
      </span>
    )),
  );
}

export function Rule({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  const ref = useRevealRef<HTMLSpanElement>();
  return <span ref={ref} className={`rule ${className}`.trim()} style={{ '--d': `${delay}ms` } as CSSProperties} aria-hidden="true" />;
}
