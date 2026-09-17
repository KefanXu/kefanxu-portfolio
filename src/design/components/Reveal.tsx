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

function show(element: Element) {
  if (gateOpen) element.classList.add('is-in');
  else waiting.add(element);
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
  waiting.forEach(element => element.classList.add('is-in'));
  waiting.clear();
}

/** Marks the element `.is-in` once it scrolls into view; style the entrance in CSS. */
export function useRevealRef<T extends Element>(clipped = false) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Chromium applies an element's own clip-path when it computes intersections,
    // so a fully clipped element never reports as visible. Clip reveals are
    // tracked by their layout box on the shared scroll loop instead.
    if (clipped) {
      const stop = onScrollFrame(({ vh }) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= vh * 0.91) return;
        stop();
        show(element);
      });
      return () => {
        stop();
        waiting.delete(element);
      };
    }

    const io = getObserver();
    io.observe(element);
    return () => {
      io.unobserve(element);
      waiting.delete(element);
    };
  }, [clipped]);
  return ref;
}

type Tag = 'div' | 'section' | 'article' | 'figure' | 'li' | 'p' | 'span' | 'header' | 'footer' | 'ul' | 'dl' | 'a';

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
