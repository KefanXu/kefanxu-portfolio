import Lenis from 'lenis';

/*
 * One smooth-scroll instance and one frame loop for the whole designer mode.
 * Components subscribe to the loop instead of attaching their own scroll
 * listeners, so every scroll-linked effect reads and writes in the same frame.
 */
export interface ScrollFrame {
  y: number;
  vh: number;
  vw: number;
  velocity: number;
  direction: 1 | -1;
}
type Subscriber = (frame: ScrollFrame) => void;

let lenis: Lenis | null = null;
let rafId = 0;
let lastY = -1;
let lastW = 0;
let lastH = 0;
let direction: 1 | -1 = 1;
let forced = true;
let paused = false;
const subscribers = new Set<Subscriber>();

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarsePointer = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

function loop() {
  const y = window.scrollY;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (forced || y !== lastY || vw !== lastW || vh !== lastH) {
    if (y !== lastY) direction = y > lastY ? 1 : -1;
    const frame: ScrollFrame = { y, vh, vw, velocity: lenis?.velocity ?? y - lastY, direction };
    lastY = y;
    lastW = vw;
    lastH = vh;
    forced = false;
    subscribers.forEach(subscriber => subscriber(frame));
  }
  rafId = requestAnimationFrame(loop);
}

export function startScroll() {
  if (!reducedMotion() && !lenis) {
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.105,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      anchors: false,
      // Scrollable children (a reader dialog, a citation box) keep the wheel.
      allowNestedScroll: true,
    });
    // A modal that opened before the scroller existed (a direct reader URL)
    // has already asked for it to wait.
    if (paused) lenis.stop();
  }
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(loop);
  // Content that changes height without a scroll (late images, open demos)
  // still gets one fresh frame for every scroll-linked piece.
  const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => { forced = true; });
  resize?.observe(document.body);
  return () => {
    resize?.disconnect();
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
  };
}

/** Subscribe to scroll/resize frames. The callback also runs once right away. */
export function onScrollFrame(subscriber: Subscriber) {
  subscribers.add(subscriber);
  forced = true;
  return () => {
    subscribers.delete(subscriber);
  };
}

/** Ask every subscriber to recompute on the next frame (layout changed). */
export function refreshScroll() {
  forced = true;
  lenis?.resize();
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
  forced = true;
}

export function scrollToElement(target: HTMLElement | string, offset = 0) {
  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (!element) return;
  if (lenis) {
    lenis.scrollTo(element, { offset, duration: 1.5, easing: t => 1 - Math.pow(1 - t, 4) });
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }
}

/** Scroll the page to an absolute position through the smooth scroller. */
export function scrollToY(top: number, immediate = false) {
  if (lenis) lenis.scrollTo(top, { immediate, duration: 1.3, easing: t => 1 - Math.pow(1 - t, 4), force: true });
  else window.scrollTo({ top, behavior: immediate || reducedMotion() ? 'auto' : 'smooth' });
  forced = true;
}

/** Pause or resume smooth scrolling while a modal owns the wheel; styles untouched. */
export function pauseScroll(pause: boolean) {
  paused = pause;
  if (pause) lenis?.stop();
  else lenis?.start();
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  // Keep the layout from jumping sideways when a classic scrollbar disappears.
  const root = document.documentElement;
  const scrollbar = window.innerWidth - root.clientWidth;
  root.style.paddingRight = locked && scrollbar > 0 ? `${scrollbar}px` : '';
  root.style.overflow = locked ? 'hidden' : '';
}
