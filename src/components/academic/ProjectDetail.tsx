import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Image, Play, X } from 'lucide-react';
import { projects } from '../../data/portfolio';
import { publications } from '../../data/publications';
import { projectCaseStudies, type ProjectCaseStudy, type ProjectFigure } from '../../data/projectCaseStudies';
import { pauseScroll, reducedMotion } from '../../design/lib/scroll';
import { coloursFor, ReaderWipe, type WipeColours, type WipePhase } from './ReaderWipe';
import './ProjectDetail.css';

/** Set by the gallery when a reader opens behind its colour sweep. */
export interface ReaderArrival extends WipeColours {
  id: string;
  opener: HTMLElement | null;
  restoreFocus: boolean;
}

interface ProjectDetailProps {
  arrival?: ReaderArrival | null;
  /** The veil has lifted; the arrival can be forgotten. */
  onArrivalComplete?: () => void;
  /** The veil covers the reader; put the page panel up, then call `close`. */
  onLeave?: (colours: WipeColours, close: () => void) => void;
  /** The dialog has actually closed. */
  onClosed?: () => void;
}

const VEIL_LIFT_MS = 900;
const VEIL_COVER_MS = 560;

function projectIdFromHash() {
  if (!window.location.hash.startsWith('#project/')) return null;
  const id = window.location.hash.slice('#project/'.length);
  return projectCaseStudies.some(project => project.id === id) ? id : null;
}

function ProjectVideoPlayer({ study }: { study: ProjectCaseStudy }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const video = study.video;

  useEffect(() => {
    if (!isPlaying) return;
    const frame = requestAnimationFrame(() => playerRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  if (!video) return null;
  const captionId = `project-video-caption-${study.id}`;
  const thumbnailUrl = video.poster
    ? `${import.meta.env.BASE_URL}images/projects/${video.poster}`
    : `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1&playsinline=1&rel=0`;

  return (
    <figure className="project-media-video">
      <div className="project-video-frame">
        {isPlaying ? (
          <iframe
            ref={playerRef}
            className="project-video-embed"
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" className="project-video-launch" onClick={() => setIsPlaying(true)} aria-label={`Play ${video.title} on this page`} aria-describedby={captionId}>
            <img src={thumbnailUrl} alt="" width="1280" height="720" decoding="async" />
            <span className="project-video-play"><Play size={15} fill="currentColor" aria-hidden="true" /> Play film</span>
          </button>
        )}
      </div>
      <figcaption id={captionId}>
        <span>Film 01</span>
        <p>
          {video.caption}{' '}
          <a className="project-video-source" href={video.url} target="_blank" rel="noopener noreferrer">
            Open on YouTube <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        </p>
      </figcaption>
    </figure>
  );
}

function ProjectFigureItem({ figure, index, className, eager = false }: { figure: ProjectFigure; index: number; className?: string; eager?: boolean }) {
  return (
    <figure className={className}>
      <a className="project-figure-image" href={`${import.meta.env.BASE_URL}images/projects/${figure.src}`} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${figure.alt}`}>
        <img src={`${import.meta.env.BASE_URL}images/projects/${figure.src}`} alt={figure.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        <span className="project-figure-expand"><ArrowUpRight size={16} aria-hidden="true" /><span>View full size</span></span>
      </a>
      <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{figure.caption}</figcaption>
    </figure>
  );
}

function ProjectFigureCredit({ study }: { study: ProjectCaseStudy }) {
  if (!study.figureSource) return null;
  return (
    <p className="project-figure-credit">
      <a href={study.figureSource.url} target="_blank" rel="noopener noreferrer">{study.figureSource.label}<ArrowUpRight size={13} aria-hidden="true" /></a>
      <span>{study.figureSource.license && <><a href={study.figureSource.license.url} target="_blank" rel="noopener noreferrer">{study.figureSource.license.label}</a>. </>}{study.figureSource.credit}</span>
    </p>
  );
}

function ProjectMedia({ study }: { study: ProjectCaseStudy }) {
  const video = study.video ? <ProjectVideoPlayer key={study.id} study={study} /> : null;

  const figures = study.figures ? (
    <div className={`project-media-documentation is-${study.id}`}>
      <div className={`project-figure-grid ${study.figures.length > 1 ? 'has-panels' : ''}`}>
        {study.figures.map((figure, index) => (
          <ProjectFigureItem key={figure.src} figure={figure} index={index} eager={index === 0} />
        ))}
      </div>
      <ProjectFigureCredit study={study} />
    </div>
  ) : null;

  if (!video && !figures) {
    return (
      <div className="project-media-placeholder">
        <span className="project-placeholder-corner corner-top" aria-hidden="true" />
        <Image size={34} strokeWidth={1} aria-hidden="true" />
        <span className="project-placeholder-label">Project imagery</span>
        <p className="project-placeholder-title">{study.placeholder?.title}</p>
        <p>{study.placeholder?.description}</p>
        <span className="project-placeholder-corner corner-bottom" aria-hidden="true" />
      </div>
    );
  }

  return <div className={`project-media-stack${video && figures ? ' has-video-and-figures' : ''}`}>{video}{figures}</div>;
}

/** Self-contained project reader. Any #project/ID link on the page opens it. */
export function ProjectDetail({ arrival, onArrivalComplete, onLeave, onClosed }: ProjectDetailProps = {}) {
  const [activeId, setActiveId] = useState<string | null>(projectIdFromHash);
  const activeIdRef = useRef(activeId);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef(false);
  const openedFromPageRef = useRef(false);
  const previousOverflowRef = useRef<string | null>(null);
  const lastProjectRef = useRef(activeId);
  const activeIndex = projectCaseStudies.findIndex(study => study.id === activeId);
  const study = projectCaseStudies[activeIndex];
  const project = projects.find(item => item.id === activeId);
  const publication = study?.publicationId ? publications.find(item => item.id === study.publicationId) : undefined;
  const editorialFigures = study?.figureLayout === 'editorial' ? study.figures ?? [] : [];

  // The colour veil: it already covers the reader when it opens behind the
  // page panel (`hold`, then `reveal`), and rises over the reader again before
  // it closes (`idle`, then `cover`).
  const isArriving = Boolean(activeId && arrival && arrival.id === activeId);
  const arrivedRef = useRef(false);
  if (isArriving) arrivedRef.current = true;
  if (!activeId) arrivedRef.current = false;
  const [veilPhase, setVeilPhase] = useState<WipePhase | null>(null);
  const veilColours = useRef<WipeColours | null>(null);
  const leavingRef = useRef(false);
  const arrivalRef = useRef(arrival);
  arrivalRef.current = arrival;
  const onClosedRef = useRef(onClosed);
  onClosedRef.current = onClosed;
  const veil = veilPhase && veilColours.current
    ? { ...veilColours.current, phase: veilPhase }
    : isArriving && arrival ? { ink: arrival.ink, paper: arrival.paper, name: arrival.name, number: arrival.number, phase: 'hold' as WipePhase } : null;

  useEffect(() => {
    if (!isArriving || !arrival) return;
    veilColours.current = arrival;
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => setVeilPhase('reveal')); });
    const timer = window.setTimeout(() => { setVeilPhase(null); onArrivalComplete?.(); }, VEIL_LIFT_MS);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timer); };
  }, [isArriving, arrival, onArrivalComplete]);

  useEffect(() => {
    const syncHash = () => {
      const next = projectIdFromHash();
      if (next && !activeIdRef.current) openedFromPageRef.current = true;
      activeIdRef.current = next;
      setActiveId(next);
    };
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
      if (previousOverflowRef.current !== null) document.body.style.overflow = previousOverflowRef.current;
      dialogRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let frame = 0;
    if (activeId) {
      lastProjectRef.current = activeId;
      if (!dialog.open) {
        // A sweep passes its initiating control and activation modality
        // explicitly. Direct hash links use :focus-visible as the browser's
        // own modality signal.
        const arrived = arrivalRef.current?.id === activeId ? arrivalRef.current : null;
        const opener = arrived ? arrived.opener : document.activeElement instanceof HTMLElement ? document.activeElement : null;
        openerRef.current = opener;
        restoreFocusRef.current = arrived
          ? arrived.restoreFocus
          : Boolean(opener && opener !== document.body && opener.matches(':focus-visible'));
        previousOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        pauseScroll(true);
        dialog.showModal();
      }
      dialog.scrollTop = 0;
      frame = requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }));
    } else if (dialog.open) {
      dialog.close();
      if (previousOverflowRef.current !== null) document.body.style.overflow = previousOverflowRef.current;
      previousOverflowRef.current = null;
      openedFromPageRef.current = false;
      leavingRef.current = false;
      setVeilPhase(null);
      pauseScroll(false);
      onClosedRef.current?.();
      frame = requestAnimationFrame(() => {
        const opener = openerRef.current;
        if (restoreFocusRef.current) {
          if (opener && opener !== document.body && opener.isConnected) opener.focus({ preventScroll: true });
          else document.querySelector<HTMLElement>(`a[href="#project/${lastProjectRef.current}"]`)?.focus({ preventScroll: true });
        } else {
          const focused = document.activeElement;
          if (focused instanceof HTMLElement && focused !== document.body) focused.blur();
        }
        openerRef.current = null;
        restoreFocusRef.current = false;
      });
    }
    return () => cancelAnimationFrame(frame);
  }, [activeId]);

  function leaveReader() {
    if (openedFromPageRef.current) {
      window.history.back();
    } else {
      window.history.replaceState(window.history.state, '', '#projects');
      activeIdRef.current = null;
      setActiveId(null);
      requestAnimationFrame(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'auto' }));
    }
  }

  function closeProject() {
    if (leavingRef.current) return;
    const colours = activeId && onLeave && !reducedMotion() ? coloursFor(activeId) : null;
    if (!colours || !onLeave) { leaveReader(); return; }
    // Cover the reader with its colour first, then hand the panel to the page.
    leavingRef.current = true;
    veilColours.current = colours;
    setVeilPhase('idle');
    requestAnimationFrame(() => requestAnimationFrame(() => setVeilPhase('cover')));
    window.setTimeout(() => onLeave(colours, leaveReader), VEIL_COVER_MS);
  }

  function changeProject(id: string) {
    // Keep one browser-history entry for the reader, so Back returns to the page.
    window.history.replaceState(window.history.state, '', `#project/${id}`);
    activeIdRef.current = id;
    setActiveId(id);
  }

  return (
    <dialog className={`project-dialog${arrivedRef.current ? ' is-arriving' : ''}`} ref={dialogRef} aria-labelledby="project-detail-title" data-lenis-prevent onCancel={event => { event.preventDefault(); closeProject(); }}>
      {veil && <ReaderWipe {...veil} />}
      {study && project && <>
        <header className="project-reader-header">
          <button type="button" className="project-back-button" onClick={closeProject}><ArrowLeft size={17} aria-hidden="true" /><span>Back to page</span></button>
          <span className="project-reader-label">{study.name}<span>Research project {String(activeIndex + 1).padStart(2, '0')} / {String(projectCaseStudies.length).padStart(2, '0')}</span></span>
          <button type="button" className="project-close-button" aria-label="Close project" onClick={closeProject}><X size={22} strokeWidth={1.4} aria-hidden="true" /></button>
        </header>
        <article className={`project-detail-content project-detail--${project.id}`}>
          <div className="project-detail-hero">
            <div className="project-detail-title-block">
              <p className="eyebrow">{study.category}</p>
              <h2 id="project-detail-title" ref={titleRef} tabIndex={-1}>{study.name}</h2>
              <p className="project-detail-subtitle">{study.subtitle}</p>
            </div>
            <div className="project-detail-introduction">
              <p className="project-detail-overview">{study.overview}</p>
              <dl className="project-detail-metadata">
                <div><dt>Role</dt><dd>{project.role}</dd></div>
                <div><dt>Period</dt><dd>{project.period}</dd></div>
                <div className="project-detail-collaboration"><dt>Collaboration</dt><dd>{project.collaboration}</dd></div>
              </dl>
              {study.paper && <a className="text-link" href={study.paper.url} target="_blank" rel="noopener noreferrer">{study.paper.label}<ArrowUpRight size={16} aria-hidden="true" /></a>}
            </div>
          </div>

          {study.figureLayout !== 'editorial' && <ProjectMedia study={study} />}

          <div className="project-detail-editorial">
            <section className="project-detail-section" aria-labelledby="project-context-heading">
              <p className="eyebrow">01 / Research context</p>
              <div><h3 id="project-context-heading">{project.title}</h3><p>{study.context}</p>
                {editorialFigures[0] && <ProjectFigureItem figure={editorialFigures[0]} index={0} className="project-editorial-figure" eager />}
              </div>
            </section>
            <section className="project-detail-section" aria-labelledby="project-design-heading">
              <p className="eyebrow">{study.designLabel ?? `02 / ${project.id === 'caregiving-reddit' ? 'Research approach' : 'Design & implementation'}`}</p>
              <div><h3 id="project-design-heading">{study.designHeading ?? (project.id === 'caregiving-reddit' ? 'Following caregiving over time' : 'Designing the research experience')}</h3>
                <div className="project-design-grid">{study.design.map((item, index) => <div className="project-design-item" key={item.title}><span className="project-design-number">0{index + 1}</span><h4>{item.title}</h4><p>{item.description}</p></div>)}</div>
                {editorialFigures[1] && <ProjectFigureItem figure={editorialFigures[1]} index={1} className="project-editorial-figure is-portrait" />}
              </div>
            </section>
            <section className="project-detail-section" aria-labelledby="project-study-heading">
              <p className="eyebrow">{study.studyLabel ?? '03 / Study & evidence'}</p>
              <div><h3 id="project-study-heading">{study.studyHeading ?? (project.id === 'ducss' ? 'Research in progress' : project.id === 'sedentary' ? 'A proposed study of situated activity data' : 'Studying the experience')}</h3>
                <div className="project-evidence">{study.evidence.map(item => <div key={item.label}><span>{item.value}</span><p>{item.label}</p></div>)}</div>
                {editorialFigures[2] && <ProjectFigureItem figure={editorialFigures[2]} index={2} className="project-editorial-figure is-study-overview" />}
                <p>{study.study}</p>
                {editorialFigures[3] && <ProjectFigureItem figure={editorialFigures[3]} index={3} className="project-editorial-figure is-method" />}
                {editorialFigures.length > 0 && <ProjectFigureCredit study={study} />}
              </div>
            </section>
            <section className="project-detail-section" aria-labelledby="project-contributions-heading">
              <p className="eyebrow">04 / My contributions</p>
              <div><h3 id="project-contributions-heading">{project.id === 'caregiving-reddit' ? 'Research design and analysis' : 'Research, design, and development'}</h3><ul className="project-contribution-list">{project.description.map(description => <li key={description}>{description}</li>)}</ul><p className="project-detail-tags">{project.tags?.join(' · ')}</p></div>
            </section>
            {study.paper && <section className="project-related-paper" aria-labelledby="project-paper-heading"><div><p className="eyebrow">Related publication</p><h3 id="project-paper-heading">{publication?.title ?? project.title}</h3>{publication && <p>{publication.authors.join(', ')} · {publication.conference}</p>}</div><a className="text-link" href={study.paper.url} target="_blank" rel="noopener noreferrer">Read paper<ArrowUpRight size={17} aria-hidden="true" /></a></section>}
          </div>

          <nav className="project-reader-pagination" aria-label="Browse research projects">
            <button type="button" onClick={() => changeProject(projectCaseStudies[(activeIndex + projectCaseStudies.length - 1) % projectCaseStudies.length].id)}><span><ArrowLeft size={15} aria-hidden="true" />Previous project</span><strong>{projectCaseStudies[(activeIndex + projectCaseStudies.length - 1) % projectCaseStudies.length].name}</strong></button>
            <button type="button" onClick={() => changeProject(projectCaseStudies[(activeIndex + 1) % projectCaseStudies.length].id)}><span>Next project<ArrowRight size={15} aria-hidden="true" /></span><strong>{projectCaseStudies[(activeIndex + 1) % projectCaseStudies.length].name}</strong></button>
          </nav>
        </article>
      </>}
    </dialog>
  );
}
