import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { projects } from '../../data/portfolio';
import { ProjectDetail } from './ProjectDetail';
import { BookCover, researchBooks, type ResearchBookStudy } from './ResearchBook';
import './ResearchGallery.css';

type OpenBook = { study: ResearchBookStudy; index: number; opener: HTMLElement; restoreFocus: boolean; rect: { left: number; top: number; width: number; height: number }; width: number; height: number; viewportWidth: number; viewportHeight: number };
type OpenHandler = (event: MouseEvent<HTMLAnchorElement>, study: ResearchBookStudy, index: number) => void;
const bookEase = [0.22, 1, 0.36, 1] as const;

function ResearchFolio({ study, index, onOpen }: { study: ResearchBookStudy; index: number; onOpen: OpenHandler }) {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const project = projects.find(item => item.id === study.id);
  const projectId = project?.id ?? study.id;
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  const direction = index % 2 === 0 ? -1 : 1;
  const turn = useTransform(scrollYProgress, [0, 0.42, 1], [direction * 34, direction * 5, direction * -9]);
  const lean = useTransform(scrollYProgress, [0, 0.42, 1], [direction * 5, direction, direction * -2]);
  const lift = useTransform(scrollYProgress, [0, 0.42, 1], [26, 0, -18]);
  const open = (event: MouseEvent<HTMLAnchorElement>) => onOpen(event, study, index);

  return <motion.article ref={cardRef} id={projectId} className={`research-folio research-folio--${study.color}`} initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: bookEase }}>
    <a className="folio-stage" href={`#project/${projectId}`} aria-label={`Open ${study.name} project`} onClick={open}>
      <motion.div className="folio-orientation" style={reducedMotion ? {} : { rotateY: turn, rotateZ: lean, y: lift }}>
        <div className="folio-book" aria-hidden="true"><span className="folio-spine" /><BookCover study={study} index={index} /></div>
      </motion.div>
      <span className="folio-open-hint" aria-hidden="true">Open study <ArrowUpRight size={13} /></span>
    </a>
    <div className="folio-caption">
      <p className="folio-category">{study.category}</p>
      <h3><a href={`#project/${projectId}`} onClick={open}>{study.name}</a></h3>
      <p className="folio-overview">{study.overview}</p>
      {project && <p className="folio-role">{project.role}<span aria-hidden="true"> · </span>{project.period}</p>}
      <a className="folio-project-link" href={`#project/${projectId}`} onClick={open}>View project<span className="study-sr-only">: {study.name}</span><ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
    </div>
  </motion.article>;
}

function OpeningBook({ opening, handoff }: { opening: OpenBook; handoff: boolean }) {
  const { study, index, rect, width, height, viewportWidth, viewportHeight } = opening;
  return createPortal(<div className={`book-opening-scene research-folio research-folio--${study.color}${handoff ? ' is-handoff' : ''}`} aria-hidden="true">
    <motion.div className="book-opening-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
    <motion.div className="book-opening-position" initial={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }} animate={handoff ? { left: 0, top: 0, width: viewportWidth, height: viewportHeight } : { left: viewportWidth / 2 - width * 0.1, top: viewportHeight / 2 - height / 2, width, height }} transition={{ duration: handoff ? 0.7 : 0.65, ease: bookEase }}>
      <motion.div className="book-opening-object" initial={{ rotateY: -10, rotateZ: -3 }} animate={{ rotateY: 0, rotateZ: 0 }} transition={{ duration: 0.65, ease: bookEase }}>
        <motion.div className="book-opening-pageblock" animate={{ opacity: handoff ? 0 : 1 }} transition={{ duration: 0.36 }} />
        <div className="book-opening-paper"><motion.div className="book-paper-content" animate={{ opacity: handoff ? 0 : 1 }} transition={{ duration: 0.22 }}><span className="book-paper-kicker">Research studies / 0{index + 1}</span><span className="book-paper-title">{study.name}</span><span className="book-paper-theme">{study.theme}</span><div className="book-paper-rule" /><p>{study.overview}</p><span className="book-paper-author">Kefan Xu</span></motion.div></div>
        <motion.div className="book-opening-hinge" style={handoff ? { width, height, right: 'auto', bottom: 'auto' } : {}} initial={{ rotateY: 0 }} animate={{ rotateY: -151, opacity: handoff ? 0 : 1, x: handoff ? -32 : 0 }} transition={{ rotateY: { delay: 0.24, duration: 0.84, ease: [0.3, 0.05, 0.15, 1] }, opacity: { duration: 0.3 }, x: { duration: 0.6, ease: bookEase } }}>
          <div className="book-opening-front"><BookCover study={study} index={index} /></div>
          <div className="book-opening-inner"><span>KEFAN XU</span><div className="book-endpaper-orbits"><i /><i /><i /></div><span>Selected research<br />Georgia Institute of Technology</span></div>
        </motion.div>
      </motion.div>
    </motion.div>
    <motion.p className="book-opening-label" initial={{ opacity: 0 }} animate={{ opacity: handoff ? 0 : 1 }} transition={{ delay: handoff ? 0 : 0.35, duration: 0.3 }}>Opening {study.name}<span>Research study 0{index + 1}</span></motion.p>
  </div>, document.body);
}

export function ResearchGallery() {
  const reducedMotion = useReducedMotion();
  const [opening, setOpening] = useState<OpenBook | null>(null);
  const [handoff, setHandoff] = useState(false);
  const handoffRef = useRef(false);
  const releaseTransitionRef = useRef<(() => void) | null>(null);
  const finishOpening = useCallback(() => {
    releaseTransitionRef.current?.();
    handoffRef.current = false;
    setHandoff(false);
    setOpening(null);
  }, []);

  useEffect(() => () => releaseTransitionRef.current?.(), []);

  useEffect(() => {
    if (!opening) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      // Restore the page and the exact initiating control before the reader
      // captures its opener and previous body overflow state.
      releaseTransitionRef.current?.();
      handoffRef.current = true;
      setHandoff(true);
      window.location.hash = `project/${opening.study.id}`;
    }, 1210);
    const stop = () => { cancelled = true; window.clearTimeout(timer); finishOpening(); };
    const onNavigation = () => {
      // The expected reader route starts the visual handoff. Other history
      // changes still cancel immediately and leave navigation to the reader.
      if (handoffRef.current && window.location.hash === `#project/${opening.study.id}`) return;
      stop();
    };
    const onKey = (event: KeyboardEvent) => {
      if (handoffRef.current) return; // Native dialog owns Tab and Escape now.
      if (event.key === 'Tab') { event.preventDefault(); event.stopPropagation(); }
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); stop(); }
    };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('hashchange', onNavigation);
    window.addEventListener('popstate', onNavigation);
    window.addEventListener('resize', stop);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('hashchange', onNavigation);
      window.removeEventListener('popstate', onNavigation);
      window.removeEventListener('resize', stop);
      releaseTransitionRef.current?.();
    };
  }, [opening, finishOpening]);

  const openBook: OpenHandler = (event, study, index) => {
    // Modified clicks keep normal browser link behavior, including a new tab.
    if (reducedMotion || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (opening || releaseTransitionRef.current) return;
    const book = event.currentTarget.closest('article')?.querySelector('.folio-book');
    if (!book) { window.location.hash = `project/${study.id}`; return; }
    const opener = event.currentTarget;
    // A keyboard/assistive-technology click has detail 0. Preserve its focus
    // return path, while pointer activation should not leave Safari's focus
    // indicator painted around the book after the reader closes.
    const restoreFocus = event.detail === 0;
    if (restoreFocus) opener.focus({ preventScroll: true });
    const bounds = book.getBoundingClientRect();
    const width = Math.max(100, Math.min(324, (window.innerWidth - 42) / 1.96, (window.innerHeight - 185) * 0.785));
    const pageRoot = document.getElementById('root');
    const previousInert = pageRoot?.inert ?? false;
    const previousOverflow = document.body.style.overflow;
    let released = false;
    // Lock synchronously with the click; the animated cover is portaled outside
    // this inert root. Its cleanup is safe to call from every exit path.
    if (pageRoot) pageRoot.inert = true;
    document.body.style.overflow = 'hidden';
    releaseTransitionRef.current = () => {
      if (released) return;
      released = true;
      releaseTransitionRef.current = null;
      if (pageRoot) pageRoot.inert = previousInert;
      document.body.style.overflow = previousOverflow;
      if (restoreFocus && opener.isConnected) opener.focus({ preventScroll: true });
      else if (document.activeElement === opener) opener.blur();
    };
    setOpening({ study, index, opener, restoreFocus, rect: { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height }, width, height: width / 0.785, viewportWidth: window.innerWidth, viewportHeight: window.innerHeight });
  };

  return <>
    <section id="projects" className="research-gallery section-shell" aria-labelledby="research-gallery-title">
      <div className="research-gallery-heading"><div><p className="eyebrow">03 / Research projects</p><h2 id="research-gallery-title" className="section-heading">Selected <em>work.</em></h2></div><p className="research-gallery-intro">Sensing systems, mobile applications, clinical interfaces, and qualitative research in health and personal informatics.</p></div>
      <div className="research-folio-grid">{researchBooks.map((study, index) => <ResearchFolio study={study} index={index} key={study.id} onOpen={openBook} />)}</div>
    </section>
    {opening && <OpeningBook opening={opening} handoff={handoff} />}
    {createPortal(<p className="study-sr-only" role="status" aria-live="polite" aria-atomic="true">{opening ? `Opening ${opening.study.name} project.` : ''}</p>, document.body)}
    <ProjectDetail handoffProjectId={handoff ? opening?.study.id : undefined} handoffRestoreFocus={handoff ? opening?.restoreFocus : undefined} onHandoffComplete={finishOpening} />
  </>;
}
