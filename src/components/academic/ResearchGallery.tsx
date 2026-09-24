import { useCallback, useEffect, useRef, useState, type CSSProperties, type MutableRefObject, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { projects } from '../../data/portfolio';
import { Reveal, useRevealRef } from '../../design/components/Reveal';
import { pauseScroll, reducedMotion } from '../../design/lib/scroll';
import { ProjectDetail, type ReaderArrival } from './ProjectDetail';
import { coloursFor, ReaderWipe, type WipeColours, type WipePhase } from './ReaderWipe';
import { BookCover, researchBooks, type ResearchBookStudy } from './ResearchBook';
import { Words } from './Words';
import './ResearchGallery.css';

function ResearchFolio({ study, index }: { study: ResearchBookStudy; index: number }) {
  const reduced = useReducedMotion();
  const card = useRef<HTMLElement>(null);
  const reveal = useRevealRef<HTMLElement>();
  // The article is both the scroll target and the revealed element.
  const setCard = useCallback((element: HTMLElement | null) => {
    (card as MutableRefObject<HTMLElement | null>).current = element;
    reveal.current = element;
  }, [reveal]);
  const project = projects.find(item => item.id === study.id);
  const projectId = project?.id ?? study.id;
  const href = `#project/${projectId}`;
  // The cover turns a little as its card travels up the page…
  const { scrollYProgress } = useScroll({ target: card, offset: ['start end', 'end start'] });
  const direction = index % 2 === 0 ? -1 : 1;
  const turn = useTransform(scrollYProgress, [0, 0.42, 1], [direction * 34, direction * 5, direction * -9]);
  const lean = useTransform(scrollYProgress, [0, 0.42, 1], [direction * 5, direction, direction * -2]);
  const lift = useTransform(scrollYProgress, [0, 0.42, 1], [26, 0, -18]);

  // …and leans toward the pointer while it travels over the card (CSS reads --tx/--ty).
  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const element = card.current;
    if (!element || event.pointerType !== 'mouse') return;
    const bounds = element.getBoundingClientRect();
    element.style.setProperty('--tx', ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(3));
    element.style.setProperty('--ty', ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(3));
  };
  const onPointerLeave = () => {
    card.current?.style.removeProperty('--tx');
    card.current?.style.removeProperty('--ty');
  };

  return <article ref={setCard} id={projectId} className={`research-folio research-folio--${study.color}`} data-reveal="up" style={{ '--d': `${(index % 3) * 90}ms` } as CSSProperties} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
    <a className="folio-stage" href={href} aria-label={`Open ${study.name} project`} data-cursor="Open">
      <motion.div className="folio-orientation" style={reduced ? {} : { rotateY: turn, rotateZ: lean, y: lift }}>
        <div className="folio-book" aria-hidden="true"><span className="folio-spine" /><BookCover study={study} index={index} /></div>
      </motion.div>
    </a>
    <div className="folio-caption">
      <p className="folio-category">{study.category}</p>
      <h3><a href={href}>{study.name}</a></h3>
      <p className="folio-overview">{study.overview}</p>
      {project && <p className="folio-role">{project.role}<span aria-hidden="true"> · </span>{project.period}</p>}
      <a className="folio-project-link" href={href}>View project<span className="study-sr-only">: {study.name}</span><ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
    </div>
  </article>;
}

type Wipe = WipeColours & { phase: WipePhase };

/* The opening follows the designer site's page wipe: the colour panel rises
   over the page (COVER_MS), the reader opens behind it, and the panel keeps
   rising off the reader (REVEAL_MS, timed in ProjectDetail). */
const COVER_MS = 760;
const REVEAL_MS = 900;

export function ResearchGallery() {
  const [wipe, setWipe] = useState<Wipe | null>(null);
  const [arrival, setArrival] = useState<ReaderArrival | null>(null);
  const wipeRef = useRef<Wipe | null>(null);
  wipeRef.current = wipe;
  const releaseRef = useRef<(() => void) | null>(null);
  const timers = useRef<number[]>([]);
  const frames = useRef<number[]>([]);
  const later = useCallback((callback: () => void, delay: number) => { timers.current.push(window.setTimeout(callback, delay)); }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(timer => window.clearTimeout(timer)); timers.current = [];
    frames.current.forEach(frame => window.cancelAnimationFrame(frame)); frames.current = [];
  }, []);

  useEffect(() => () => { clearTimers(); releaseRef.current?.(); }, [clearTimers]);

  // Every #project/<id> link on the page opens the reader behind a colour
  // sweep. Modified clicks and reduced motion keep plain hash navigation.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#project/"]') as HTMLAnchorElement | null;
      if (!link || reducedMotion()) return;
      const id = link.getAttribute('href')!.slice('#project/'.length);
      const colours = coloursFor(id);
      if (!colours) return;
      event.preventDefault();
      if (releaseRef.current || wipeRef.current) return; // a transition is already running
      // A keyboard/assistive-technology click has detail 0; keep its focus
      // return path, while pointer activation should not leave a focus ring
      // painted around the cover after the reader closes.
      const restoreFocus = event.detail === 0;
      if (restoreFocus) link.focus({ preventScroll: true });

      // Hold the page still under the panel; release before the reader opens
      // so it captures the page's ordinary state and can restore it.
      const pageRoot = document.getElementById('root');
      const previousInert = pageRoot?.inert ?? false;
      const previousOverflow = document.body.style.overflow;
      if (pageRoot) pageRoot.inert = true;
      document.body.style.overflow = 'hidden';
      pauseScroll(true);
      let released = false;
      releaseRef.current = () => {
        if (released) return;
        released = true;
        releaseRef.current = null;
        if (pageRoot) pageRoot.inert = previousInert;
        document.body.style.overflow = previousOverflow;
      };

      setArrival({ id, ...colours, opener: link, restoreFocus });
      // Mount the panel below the viewport first, so the switch to `cover`
      // a frame later plays as a rise rather than appearing already in place.
      setWipe({ ...colours, phase: 'idle' });
      frames.current.push(requestAnimationFrame(() => {
        frames.current.push(requestAnimationFrame(() => setWipe(current => current?.phase === 'idle' ? { ...current, phase: 'cover' } : current)));
      }));
      // Two frames of lead-in, then the full rise, before the reader opens
      // behind the panel with its own veil already in place.
      later(() => {
        releaseRef.current?.();
        setWipe(current => current && { ...current, phase: 'hold' });
        window.location.hash = `project/${id}`;
      }, COVER_MS + 30);
      // By now the reader and its own veil are on top; the page panel can go.
      later(() => setWipe(current => current?.phase === 'hold' ? null : current), COVER_MS + 360);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [later]);

  // While the panel is still rising, Escape or any navigation cancels the opening.
  useEffect(() => {
    if (wipe?.phase !== 'cover') return;
    const cancel = () => {
      clearTimers();
      releaseRef.current?.();
      pauseScroll(false);
      setWipe(null);
      setArrival(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') event.preventDefault();
      if (event.key === 'Escape') { event.preventDefault(); cancel(); }
    };
    const onNavigation = () => { if (!window.location.hash.startsWith('#project/')) cancel(); };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('hashchange', onNavigation);
    window.addEventListener('popstate', onNavigation);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('hashchange', onNavigation);
      window.removeEventListener('popstate', onNavigation);
    };
  }, [wipe?.phase, clearTimers]);

  const onArrivalComplete = useCallback(() => setArrival(null), []);

  // Closing: the reader's veil has covered its content; put the page panel up
  // underneath, let the dialog close, then lift the panel off the page.
  const onLeave = useCallback((colours: WipeColours, close: () => void) => {
    clearTimers();
    setWipe({ ...colours, phase: 'hold' });
    requestAnimationFrame(() => requestAnimationFrame(close));
  }, [clearTimers]);
  const onClosed = useCallback(() => {
    if (wipeRef.current?.phase !== 'hold') return;
    later(() => setWipe(current => current?.phase === 'hold' ? { ...current, phase: 'reveal' } : current), 60);
    later(() => setWipe(current => current?.phase === 'reveal' ? null : current), 60 + REVEAL_MS + 40);
  }, [later]);

  return <>
    <section id="projects" className="research-gallery section-shell" aria-labelledby="research-gallery-title">
      <div className="research-gallery-heading">
        <div>
          <Reveal as="p" kind="fade" className="eyebrow">03 / Research projects</Reveal>
          <Words id="research-gallery-title" className="section-heading" text="Selected *work.*" />
        </div>
        <Reveal as="p" className="research-gallery-intro" delay={180}>Sensing systems, mobile applications, clinical interfaces, and qualitative research in health and personal informatics.</Reveal>
      </div>
      <div className="research-folio-grid">{researchBooks.map((study, index) => <ResearchFolio study={study} index={index} key={study.id} />)}</div>
    </section>
    {wipe && createPortal(<ReaderWipe {...wipe} />, document.body)}
    {createPortal(<p className="study-sr-only" role="status" aria-live="polite" aria-atomic="true">{wipe?.phase === 'cover' ? `Opening ${wipe.name} project.` : ''}</p>, document.body)}
    <ProjectDetail arrival={arrival} onArrivalComplete={onArrivalComplete} onLeave={onLeave} onClosed={onClosed} />
  </>;
}
