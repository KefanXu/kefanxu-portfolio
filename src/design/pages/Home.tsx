import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy } from 'lucide-react';
import { Cover } from '../components/Covers';
import { Phone } from '../components/Device';
import { Magnetic } from '../components/Magnetic';
import { Reveal, Rule, SplitText } from '../components/Reveal';
import { img, researchHref } from '../data/img';
import { archive, experience, heroWords, principles, profile, recognition, toolkit } from '../data/profile';
import { projects } from '../data/projects';
import type { Project } from '../data/types';
import { useRouter, workHref } from '../lib/router';
import { coarsePointer, onScrollFrame, scrollToTop } from '../lib/scroll';
import { goToMode } from '../../mode/modeSwitch';
import cvPdf from '../../assets/KefanXu_CV.pdf';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/* ── Hero ──────────────────────────────────────────────────────────────── */
const fan = [
  { src: img('physicify/final-calendar-planning.webp'), alt: '' },
  { src: img('moodloop/app-10.webp'), alt: '' },
  { src: img('trackya/app-1.webp'), alt: '' },
  { src: img('moodloop/app-08.webp'), alt: '' },
  { src: img('planneregy/app-mock-1.webp'), alt: '' },
];

function Hero() {
  const root = useRef<HTMLElement>(null);
  const { link } = useRouter();

  useEffect(() => onScrollFrame(({ y, vh }) => {
    const element = root.current;
    if (!element) return;
    element.style.setProperty('--hp', clamp(y / (vh * 0.9)).toFixed(4));
  }), []);

  return (
    <section ref={root} className="hero" id="top" aria-labelledby="hero-title">
      <div className="shell hero__inner">
        <Reveal kind="fade" delay={120} className="hero__meta">
          <span className="pill"><i className="dot" aria-hidden="true" />{profile.availability}</span>
          <span className="mono hero__meta-right">Product designer · PhD researcher, Georgia Tech</span>
        </Reveal>

        <SplitText as="h1" id="hero-title" className="display hero__title" delay={180} text="I design health products that *hold up* in real life." />

        <div className="hero__row">
          <Reveal delay={700} className="hero__lede">
            <p className="lede">
              I take ideas from first interview to Figma to shipped app, then live with the result: multi-week field studies with the people who use it, not five-minute tests.
            </p>
          </Reveal>
          <Reveal delay={820} className="hero__cta">
            <Magnetic>
              <a className="btn" href={workHref(projects[0].slug)} onClick={link(workHref(projects[0].slug))}>
                Start with {projects[0].name} <ArrowRight size={18} aria-hidden="true" />
              </a>
            </Magnetic>
            <a className="hero__scroll mono" href="#/" onClick={link('#/', { section: 'work' })}>
              Selected work ({String(projects.length).padStart(2, '0')}) <ArrowDown size={14} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>

      <Reveal kind="fade" delay={300} className="hero__fan" aria-hidden="true">
        {fan.map((shot, index) => (
          <div key={shot.src} className={`hero__phone hero__phone--${index}`} style={{ '--d': `${480 + Math.abs(index - 2) * 120}ms` } as CSSProperties}>
            <Phone shot={shot} eager decorative />
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* ── Marquee ───────────────────────────────────────────────────────────── */
function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let offset = 0;
    let last = performance.now();
    let boost = 0;
    let raf = 0;
    const unsubscribe = onScrollFrame(({ velocity }) => { boost = clamp(Math.abs(velocity) / 40, 0, 4) * Math.sign(velocity || 1); });
    const tick = (now: number) => {
      const element = track.current;
      if (element) {
        const dt = Math.min(64, now - last);
        const half = element.scrollWidth / 2;
        offset = (offset + dt * 0.045 * (1 + Math.abs(boost)) * (boost < 0 ? -1 : 1) + half) % half;
        element.style.transform = `translate3d(${-offset}px, 0, 0)`;
        boost *= 0.94;
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); unsubscribe(); };
  }, []);

  const words = [...heroWords, ...heroWords];
  return (
    <div className="marquee" aria-hidden="true">
      <div ref={track} className="marquee__track">
        {words.map((word, index) => <span key={index}>{word}<i /></span>)}
      </div>
    </div>
  );
}

/* ── Statement ─────────────────────────────────────────────────────────── */
const statement =
  'I am a product designer who researches, designs and builds. Over the past five years I have taken health and wellbeing products from the first interview to working software, deployed them for weeks at a time with the people they are for, and published what we learned at CHI and CSCW. I am looking for a team where that kind of care makes better products.';

function Statement() {
  const root = useRef<HTMLDivElement>(null);
  const words = statement.split(' ');

  useEffect(() => onScrollFrame(({ vh }) => {
    const element = root.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const progress = clamp((vh * 0.86 - bounds.top) / (bounds.height + vh * 0.36));
    const spans = element.querySelectorAll<HTMLElement>('[data-w]');
    const head = progress * (spans.length + 6);
    spans.forEach((span, index) => { span.style.opacity = String(clamp(head - index, 0.16, 1)); });
  }), []);

  const stats = [
    { value: '6', label: 'Peer-reviewed papers · CHI, CSCW, DIS' },
    { value: '3', label: 'Field deployments of 28–42 days' },
    { value: '80+', label: 'Participants across my studies' },
    { value: '5 yrs', label: 'Designing for health & care' },
  ];

  return (
    <section className="statement shell" aria-label="Introduction">
      <span className="mono statement__eyebrow">(Intro)</span>
      <div ref={root} className="statement__text">
        <p className="sr-only">{statement}</p>
        <p aria-hidden="true">{words.map((word, index) => <span key={index} data-w>{word} </span>)}</p>
      </div>
      <dl className="statement__stats">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 90} className="statement__stat">
            <dt>{stat.value}</dt>
            <dd className="mono">{stat.label}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/* ── Selected work ─────────────────────────────────────────────────────── */
function WorkCard({ project, index }: { project: Project; index: number }) {
  const { link } = useRouter();
  const href = workHref(project.slug);
  const onPointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (coarsePointer()) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--px', (((event.clientX - bounds.left) / bounds.width) * 2 - 1).toFixed(3));
    event.currentTarget.style.setProperty('--py', (((event.clientY - bounds.top) / bounds.height) * 2 - 1).toFixed(3));
  };
  const onPointerLeave = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--px', '0');
    event.currentTarget.style.setProperty('--py', '0');
  };

  return (
    <li className="work__item" data-work-item style={{ '--i': index } as CSSProperties}>
      <a
        className={`work-card${project.theme.dark ? ' work-card--dark' : ''}`}
        href={href}
        onClick={link(href)}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        data-cursor="View case"
        data-cover-host
        style={{ '--panel': project.theme.panel, '--panel-ink': project.theme.ink, '--accent': project.theme.accent, '--soft': project.theme.soft } as CSSProperties}
        aria-label={`${project.name}: ${project.summary} View the case study.`}
      >
        {/* Liquid glass: colour drifting under a frosted surface; the pointer light reads --px/--py. */}
        <span className="work-card__liquid" aria-hidden="true">
          <i className="work-card__blob work-card__blob--a" />
          <i className="work-card__blob work-card__blob--b" />
          <i className="work-card__blob work-card__blob--c" />
          <i className="work-card__blob work-card__blob--light" />
        </span>
        <span className="work-card__glass" aria-hidden="true" />
        <div className="work-card__text">
          <div className="work-card__top mono">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>{project.kicker}</span>
          </div>
          <div className="work-card__body">
            <h3 className="work-card__name">{project.name}</h3>
            <p className="work-card__summary">{project.summary}</p>
            <ul className="work-card__tags mono">{project.tags.slice(0, 3).map(tag => <li key={tag}>{tag}</li>)}</ul>
          </div>
          <div className="work-card__foot">
            <span className="work-card__go"><span>View case study</span><i aria-hidden="true"><ArrowUpRight size={20} /></i></span>
            <span className="mono work-card__year">{project.year}<br />{project.status}</span>
          </div>
        </div>
        <div className="work-card__visual"><Cover id={project.cover} /></div>
        <span className="work-card__shade" aria-hidden="true" />
      </a>
    </li>
  );
}

function Work() {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => onScrollFrame(({ vh, vw }) => {
    const element = list.current;
    if (!element) return;
    const items = Array.from(element.querySelectorAll<HTMLElement>('[data-work-item]'));
    const stacked = vw > 900;
    const tops = items.map(item => item.getBoundingClientRect());
    items.forEach((item, index) => {
      const bounds = tops[index];
      const card = item.firstElementChild as HTMLElement;
      const through = clamp((vh - bounds.top) / (vh + bounds.height));
      card.style.setProperty('--sp', through.toFixed(4));
      // The liquid only moves while its card is near the viewport.
      item.classList.toggle('is-live', bounds.bottom > -vh * 0.25 && bounds.top < vh * 1.25);
      const next = tops[index + 1];
      const covered = stacked && next ? clamp(1 - (next.top - bounds.top) / bounds.height) : 0;
      card.style.setProperty('--covered', covered.toFixed(4));
      // Once only its top edge shows above the next card (the stack rests at a
      // 10px offset), the card sheds its expensive layers: frosted surface,
      // pools, cover. With six cards stuck in one place the GPU otherwise holds
      // six full-size blurred surfaces, which is what made Chrome drop tiles
      // and flicker.
      item.classList.toggle('is-buried', stacked && !!next && next.top - bounds.top < 16);
    });
  }), []);

  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="shell work__head">
        <SplitText as="h2" id="work-title" className="h2" text="Selected *work*" />
        <Reveal className="work__count mono" delay={200}>({String(projects.length).padStart(2, '0')}) case studies · 2021 — 2026</Reveal>
      </div>
      <ol ref={list} className="work__list shell">
        {projects.map((project, index) => <WorkCard key={project.slug} project={project} index={index} />)}
      </ol>
    </section>
  );
}

/* ── Approach ──────────────────────────────────────────────────────────── */
function Approach() {
  return (
    <section className="approach shell" id="approach" aria-labelledby="approach-title">
      <div className="approach__head">
        <span className="mono">(Approach)</span>
        <SplitText as="h2" id="approach-title" className="h2" text="Research is how I *de-risk* design." />
        <Reveal delay={200}>
          <p className="body-l muted">Four habits that show up in every project here, whether the output is a Figma file, a TestFlight build or a paper.</p>
        </Reveal>
      </div>
      <ol className="approach__list">
        {principles.map(item => (
          <li key={item.index} className="approach__item">
            <Rule />
            <Reveal className="approach__row">
              <span className="approach__index mono">{item.index}</span>
              <div>
                <h3 className="h3">{item.title}</h3>
                <p className="body-l muted">{item.body}</p>
                <p className="mono approach__proof">{item.proof}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── About ─────────────────────────────────────────────────────────────── */
function Portraits() {
  const [frame, setFrame] = useState(0);
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    if (!hovering) return;
    const id = window.setInterval(() => setFrame(value => (value + 1) % profile.portraits.length), 520);
    return () => window.clearInterval(id);
  }, [hovering]);

  return (
    <Reveal kind="clip" className="portraits">
      <div className="portraits__main" onPointerEnter={() => setHovering(true)} onPointerLeave={() => { setHovering(false); setFrame(0); }}>
        {profile.portraits.map((portrait, index) => (
          <img key={portrait.src} src={portrait.src} alt={index === 0 ? portrait.alt : ''} className={index === frame ? 'is-on' : ''} loading="lazy" decoding="async" />
        ))}
        <span className="portraits__stamp mono" aria-hidden="true">Frame {String(frame + 10).padStart(2, '0')}</span>
      </div>
    </Reveal>
  );
}

function About() {
  return (
    <section className="about shell" id="about" aria-labelledby="about-title">
      <div className="about__lead">
        <span className="mono">(About)</span>
        <SplitText as="h2" id="about-title" className="h2" text="Designer by training, researcher *by temperament.*" />
      </div>
      <div className="about__grid">
        <Portraits />
        <div className="about__bio">
          <Reveal>
            <p className="lede">
              I studied interactive media arts and data science at NYU, information science at Michigan, and I am now a PhD candidate in human-centered computing at Georgia Tech. The thread through all of it is making technology that fits into people’s actual lives.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="body-l muted">
              My projects sit in health and care: tools for people managing chronic conditions, the families who support them and the clinicians who treat them. It is a domain that punishes careless design, which is exactly why I like it. I also teach a graduate course on designing mobile experiences for wellbeing, and I mentor students on system design and study protocols.
            </p>
          </Reveal>
          <Reveal delay={160} className="about__actions">
            <a className="btn btn--ghost" href={cvPdf} target="_blank" rel="noopener noreferrer">Curriculum vitae <ArrowUpRight size={18} aria-hidden="true" /></a>
            <a className="link link--on" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>
          </Reveal>
        </div>
      </div>

      <div className="about__columns">
        <div className="about__col about__col--wide">
          <h3 className="mono">Experience & education</h3>
          <ul className="timeline">
            {experience.map(item => (
              <li key={item.role}>
                <Rule />
                <Reveal className="timeline__row">
                  <span className="mono timeline__period">{item.period}</span>
                  <div>
                    <p className="timeline__role">{item.role}</p>
                    <p className="timeline__place muted">{item.place}</p>
                    <p className="timeline__note muted">{item.note}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <div className="about__col">
          <h3 className="mono">Recognition</h3>
          <ul className="plainlist">
            {recognition.map(item => (
              <li key={item.label}><Rule /><Reveal className="plainlist__row"><span className="mono">{item.year}</span><span>{item.label}</span></Reveal></li>
            ))}
          </ul>
          <h3 className="mono about__toolkit-title">Toolkit</h3>
          <div className="toolkit">
            {toolkit.map(group => (
              <Reveal key={group.label} className="toolkit__group">
                <span className="mono">{group.label}</span>
                <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Archive ───────────────────────────────────────────────────────────── */
function Archive() {
  return (
    <section className="archive shell" id="archive" aria-labelledby="archive-title">
      <div className="archive__head">
        <SplitText as="h2" id="archive-title" className="h2" text="More work & *archive*" />
        <Reveal delay={160}><p className="body-l muted">Team projects, research-led pieces and earlier experiments in AR, data and interface design. Entries with an arrow open in the researcher mode.</p></Reveal>
      </div>
      <ul className="archive__list">
        {archive.map(entry => {
          const inner = (
            <>
              <span className="mono archive__year">{entry.year}</span>
              <span className="archive__name">{entry.name}</span>
              <span className="archive__note muted">{entry.note}</span>
              <span className="mono archive__type">{entry.type}</span>
              <span className="archive__arrow" aria-hidden="true">{entry.href ? <ArrowUpRight size={18} /> : null}</span>
            </>
          );
          return (
            <li key={entry.name}>
              <Rule />
              {entry.href
                ? <a className="archive__row archive__row--link" href={entry.href}>{inner}</a>
                : <div className="archive__row">{inner}</div>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── Contact ───────────────────────────────────────────────────────────── */
function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer className="contact" id="contact" aria-labelledby="contact-title">
      <div className="shell contact__inner">
        <span className="pill contact__pill"><i className="dot" aria-hidden="true" />{profile.availability}</span>
        <SplitText as="h2" id="contact-title" className="display contact__title" text="Let’s make something *careful.*" />
        <div className="contact__row">
          <Reveal className="contact__mail">
            <Magnetic strength={0.12}>
              <a className="contact__email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight aria-hidden="true" /></a>
            </Magnetic>
            <button type="button" className="contact__copy mono" onClick={copy} aria-live="polite">
              {copied ? <><Check size={14} aria-hidden="true" /> Copied</> : <><Copy size={14} aria-hidden="true" /> Copy address</>}
            </button>
          </Reveal>
          <Reveal delay={120} className="contact__links">
            <a className="link" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a className="link" href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a className="link" href={profile.links.scholar} target="_blank" rel="noopener noreferrer">Google Scholar <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a className="link" href={cvPdf} target="_blank" rel="noopener noreferrer">CV (PDF) <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a
              className="link"
              href={researchHref()}
              onClick={event => {
                // Same curtain as the pill; modified clicks keep their browser default.
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                event.preventDefault();
                goToMode('research');
              }}
            >
              Researcher mode <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
        <div className="contact__base mono">
          <span>© {new Date().getFullYear()} Kefan Xu</span>
          <span>{profile.location} · Designed & built with care</span>
          <a href="#top" onClick={event => { event.preventDefault(); scrollToTop(false); }}>Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Statement />
      <Work />
      <Approach />
      <About />
      <Archive />
      <Contact />
    </>
  );
}

export { Contact };
