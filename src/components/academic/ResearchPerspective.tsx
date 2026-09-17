import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Heart, Network, Users } from 'lucide-react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import './ResearchPerspective.css';

const perspectives = [
  {
    label: 'The individual', shortLabel: 'Individual', icon: Heart,
    title: 'Understanding health in everyday life',
    text: 'I study how people make sense of their health and physical activity data, and how reflection can help them adapt their plans and routines.',
    detail: 'My work in personal informatics brings together mobile applications, contextual data, and studies of people’s experiences over time.',
    link: '#project/reflective-iteration', linkLabel: 'Explore personal informatics research',
    caption: 'Personal data becomes meaningful through everyday experience.',
    description: 'An ivory sphere represents the individual. A fine teal orbit and a small sage pebble move around this center as the page scrolls.',
  },
  {
    label: 'Caregiving relationships', shortLabel: 'Relationships', icon: Users,
    title: 'Understanding care between people',
    text: 'I investigate how informal caregivers experience conflicts and life-changing events, and how online communities support their sense-making.',
    detail: 'This work examines caregiving as a changing relationship, attending to both the person receiving care and the people supporting them.',
    link: '#project/caregiving-reddit', linkLabel: 'Explore caregiving research',
    caption: 'The view expands to the people who give and receive care.',
    description: 'The composition expands into a pair of ivory and sage organic forms. Two interlocking orbits and a fine thread symbolize a caregiving relationship.',
  },
  {
    label: 'The wider context', shortLabel: 'Context', icon: Network,
    title: 'Connecting care with its context',
    text: 'I design and study sensing systems that connect clinical needs with the everyday experiences of people living with chronic conditions.',
    detail: 'Across diabetes management and PTSD care, I consider how patients, caregivers, and clinicians interpret information within their own practices and environments.',
    link: '#project/ducss', linkLabel: 'Explore health informatics research',
    caption: 'People, information, and environments form a wider ecology of care.',
    description: 'A central ivory sphere sits within three broad, crossing teal orbits. Smaller sage and teal pebbles move around it, suggesting the wider ecology of care.',
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function EcologyIllustration({ stage, reducedMotion, progress }: {
  stage: number;
  reducedMotion: boolean;
  progress: MotionValue<number>;
}) {
  const uniqueId = useId().replace(/:/g, '');
  const smoothProgress = useSpring(progress, { stiffness: 105, damping: 28, mass: 0.65 });
  const primaryRotation = useTransform(smoothProgress, [0, 1], [-46, 72]);
  const secondaryRotation = useTransform(smoothProgress, [0, 1], [58, -62]);
  const outerRotation = useTransform(smoothProgress, [0, 1], [-12, 104]);
  const nucleusDrift = useTransform(smoothProgress, [0, 1], [12, -14]);
  const companionDrift = useTransform(smoothProgress, [0, 1], [-9, 13]);
  const satelliteDrift = useTransform(smoothProgress, [0, 1], [8, -10]);
  const transition = { duration: reducedMotion ? 0 : 1.05, ease };
  const threadTransition = { duration: reducedMotion ? 0 : 1.15, ease };
  const nucleus = [
    { x: 0, y: 0, scale: 1.08 },
    { x: -60, y: -5, scale: 0.94 },
    { x: 0, y: 4, scale: 0.93 },
  ][stage];
  const companion = [
    { x: 64, y: 8, scale: 0.25, opacity: 0 },
    { x: 67, y: 8, scale: 0.84, opacity: 1 },
    { x: 152, y: -67, scale: 0.3, opacity: 1 },
  ][stage];

  return <svg className="rp-scene" viewBox="0 0 560 430" role="img" aria-labelledby={`${uniqueId}-title ${uniqueId}-description`}>
    <title id={`${uniqueId}-title`}>{perspectives[stage].label}: an ecological perspective on health</title>
    <desc id={`${uniqueId}-description`}>{perspectives[stage].description}</desc>
    <defs>
      <radialGradient id={`${uniqueId}-ivory`} cx="30%" cy="22%" r="80%">
        <stop offset="0%" stopColor="#fffef6" /><stop offset="34%" stopColor="#f3f3e8" /><stop offset="73%" stopColor="#dde4d5" /><stop offset="100%" stopColor="#bbcbb4" />
      </radialGradient>
      <radialGradient id={`${uniqueId}-sage`} cx="28%" cy="20%" r="83%">
        <stop offset="0%" stopColor="#e7eddd" /><stop offset="40%" stopColor="#c7d7bd" /><stop offset="78%" stopColor="#9bb59b" /><stop offset="100%" stopColor="#74977e" />
      </radialGradient>
      <radialGradient id={`${uniqueId}-teal`} cx="25%" cy="20%" r="80%">
        <stop offset="0%" stopColor="#80a697" /><stop offset="44%" stopColor="#487f6c" /><stop offset="100%" stopColor="#245745" />
      </radialGradient>
      <filter id={`${uniqueId}-shadow`} x="-60%" y="-60%" width="220%" height="240%">
        <feDropShadow dx="4" dy="10" stdDeviation="7" floodColor="#436348" floodOpacity=".12" />
      </filter>
      <filter id={`${uniqueId}-ground`} x="-60%" y="-150%" width="220%" height="400%"><feGaussianBlur stdDeviation="6" /></filter>
    </defs>

    {/* The inset keeps every rotated orbit and its satellites inside the SVG. */}
    <g transform="translate(280 207) scale(0.9)">
      <motion.ellipse initial={false} animate={{ cx: nucleus.x + 8, cy: 92, rx: stage === 1 ? 47 : 59, ry: 8, opacity: 0.11 }} transition={transition} fill="#5a7760" filter={`url(#${uniqueId}-ground)`} />
      <motion.ellipse initial={false} animate={{ cx: companion.x + 4, cy: stage === 2 ? -16 : 96, rx: stage === 1 ? 38 : 13, ry: stage === 1 ? 7 : 4, opacity: stage > 0 ? 0.09 : 0 }} transition={transition} fill="#5a7760" filter={`url(#${uniqueId}-ground)`} />

      <motion.g className="rp-orbit-layer rp-orbit-primary" style={{ rotate: reducedMotion ? -24 : primaryRotation, transformOrigin: '0px 0px' }}>
        <motion.ellipse initial={false} animate={{ cx: stage === 1 ? -25 : 0, cy: 0, rx: stage === 0 ? 142 : stage === 1 ? 176 : 160, ry: stage === 0 ? 89 : stage === 1 ? 102 : 112 }} transition={transition} fill="none" stroke="#89ab98" strokeWidth="1.1" />
        <motion.circle initial={false} animate={{ cx: stage === 0 ? 142 : stage === 1 ? 151 : 160, cy: 0, r: stage === 0 ? 9 : 8 }} transition={transition} fill={`url(#${uniqueId}-teal)`} filter={`url(#${uniqueId}-shadow)`} />
      </motion.g>

      <motion.g className="rp-orbit-layer rp-orbit-secondary" style={{ rotate: reducedMotion ? 28 : secondaryRotation, transformOrigin: '0px 0px' }}>
        <motion.ellipse initial={false} animate={{ cx: stage === 1 ? 26 : 0, cy: 0, rx: stage === 1 ? 169 : 182, ry: stage === 1 ? 108 : 122, opacity: stage > 0 ? 1 : 0 }} transition={transition} fill="none" stroke="#a4bfab" strokeWidth="1.05" />
        <motion.ellipse initial={false} animate={{ cx: stage === 1 ? -143 : -182, cy: 0, rx: 10, ry: 8, opacity: stage > 0 ? 1 : 0 }} transition={transition} fill={`url(#${uniqueId}-sage)`} filter={`url(#${uniqueId}-shadow)`} />
      </motion.g>

      <motion.g className="rp-orbit-layer rp-orbit-outer" style={{ rotate: reducedMotion ? -9 : outerRotation, y: reducedMotion ? 0 : satelliteDrift, transformOrigin: '0px 0px' }}>
        <motion.ellipse initial={false} animate={{ rx: stage === 2 ? 200 : 166, ry: stage === 2 ? 126 : 105, opacity: stage === 2 ? 1 : 0 }} transition={transition} fill="none" stroke="#c4d5c6" strokeWidth="1" />
        <motion.circle initial={false} animate={{ cx: 200, cy: 0, r: 7, opacity: stage === 2 ? 1 : 0 }} transition={transition} fill={`url(#${uniqueId}-teal)`} />
        <motion.circle initial={false} animate={{ cx: -134, cy: -93, r: 5, opacity: stage === 2 ? 0.85 : 0 }} transition={transition} fill="#92ad95" />
        <motion.circle initial={false} animate={{ cx: -169, cy: 67, r: 4, opacity: stage === 2 ? 0.9 : 0 }} transition={transition} fill="#71967d" />
      </motion.g>

      <motion.path d="M-82 45C-46 107 54 112 104 44" initial={false} animate={{ pathLength: stage === 1 ? 1 : 0, opacity: stage === 1 ? 0.9 : 0 }} transition={threadTransition} fill="none" stroke="#70947f" strokeWidth="1.3" strokeLinecap="round" />

      <motion.g style={{ y: reducedMotion ? 0 : companionDrift }}>
        <motion.g initial={false} animate={companion} transition={transition} style={{ transformOrigin: '0px 0px' }}>
          <path d="M-48-13C-44-48-8-60 23-46C56-31 62 3 44 31C29 56-2 61-30 41C-47 28-57 8-48-13Z" fill={`url(#${uniqueId}-sage)`} stroke="#9fb89c" strokeWidth=".7" filter={`url(#${uniqueId}-shadow)`} />
          <ellipse cx="-12" cy="-28" rx="16" ry="8" fill="#fffef6" opacity=".2" transform="rotate(-22 -12 -28)" />
        </motion.g>
      </motion.g>

      <motion.g style={{ y: reducedMotion ? 0 : nucleusDrift }}>
        <motion.g initial={false} animate={nucleus} transition={transition} style={{ transformOrigin: '0px 0px' }}>
          <circle r="58" fill={`url(#${uniqueId}-ivory)`} stroke="#d8e1d1" strokeWidth=".75" filter={`url(#${uniqueId}-shadow)`} />
          <ellipse cx="-16" cy="-32" rx="18" ry="9" fill="#fffef8" opacity=".24" transform="rotate(-22 -16 -32)" />
          <path d="M0 1C-22-12-19-26-9-26C-4-26-1-23 0-20C2-23 5-26 10-26C21-26 23-11 0 1Z" fill="none" stroke="#658573" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" transform="translate(0 12)" />
        </motion.g>
      </motion.g>

      <motion.g style={{ y: reducedMotion ? 0 : satelliteDrift }}>
        <motion.ellipse initial={false} animate={{ cx: stage === 2 ? -133 : -70, cy: stage === 2 ? 91 : 48, rx: stage === 2 ? 15 : 5, ry: stage === 2 ? 12 : 4, opacity: stage === 2 ? 1 : 0 }} transition={transition} fill={`url(#${uniqueId}-ivory)`} stroke="#d4dfce" strokeWidth=".65" filter={`url(#${uniqueId}-shadow)`} />
      </motion.g>
    </g>

    <motion.text className="rp-svg-note" initial={false} animate={{ opacity: stage === 0 ? 1 : 0 }} transition={transition} x="280" y="368">individual experience</motion.text>
    <motion.text className="rp-svg-note" initial={false} animate={{ opacity: stage === 1 ? 1 : 0 }} transition={transition} x="280" y="410">caregiving relationships</motion.text>
    <motion.text className="rp-svg-note" initial={false} animate={{ opacity: stage === 2 ? 1 : 0 }} transition={transition} x="280" y="420">everyday context</motion.text>
  </svg>;
}

export function ResearchPerspective() {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const illustration = useRef<HTMLDivElement>(null);
  const articles = useRef<(HTMLElement | null)[]>([]);
  const selectedStage = useRef<{ index: number; until: number } | null>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollY, scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });

  const readingAnchor = useCallback(() => {
    if (window.matchMedia('(max-width: 760px) and (min-height: 601px)').matches) {
      const illustrationHeight = illustration.current?.getBoundingClientRect().height ?? 270;
      const readingTop = Math.min(82 + illustrationHeight + 18, window.innerHeight * 0.68);
      return readingTop + (window.innerHeight - readingTop) * 0.43;
    }
    return window.innerHeight * 0.53;
  }, []);

  const updateStage = useCallback(() => {
    const bounds = section.current?.getBoundingClientRect();
    if (!bounds || bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    const anchor = readingAnchor();
    let closest = 0;
    let distance = Infinity;
    articles.current.forEach((article, index) => {
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const nextDistance = Math.abs(rect.top + rect.height / 2 - anchor);
      if (nextDistance < distance) { closest = index; distance = nextDistance; }
    });
    if (selectedStage.current) {
      if (closest === selectedStage.current.index || Date.now() > selectedStage.current.until) selectedStage.current = null;
      else return;
    }
    setActive(closest);
  }, [readingAnchor]);

  useMotionValueEvent(scrollY, 'change', updateStage);
  useEffect(() => {
    updateStage();
    window.addEventListener('resize', updateStage, { passive: true });
    return () => window.removeEventListener('resize', updateStage);
  }, [updateStage]);

  function selectStage(index: number) {
    const article = articles.current[index];
    if (!article) return;
    selectedStage.current = { index, until: Date.now() + 1500 };
    setActive(index);
    const bounds = article.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + bounds.top + bounds.height / 2 - readingAnchor(), behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  return <section className="rp-section section-shell" id="research" ref={section} aria-labelledby="perspective-title">
    <div className="section-topline"><p className="eyebrow">02 / RESEARCH PERSPECTIVE</p><span className="section-note">An ecological approach</span></div>
    <div className="rp-intro">
      <h2 className="section-heading" id="perspective-title">Health, care,<br />and <em>everyday life.</em></h2>
      <p>My research connects individual experience, caregiving relationships, and the contexts in which health technologies are used.</p>
    </div>
    <div className="rp-narrative">
      <div className="rp-visual" ref={illustration}>
        <figure className="rp-figure">
          <EcologyIllustration stage={active} reducedMotion={reducedMotion} progress={scrollYProgress} />
          <figcaption className="rp-caption" aria-live="polite"><span className="rp-caption-number">0{active + 1}</span><span>{perspectives[active].caption}</span></figcaption>
        </figure>
        <div className="rp-selector" role="group" aria-label="Choose a research perspective">
          {perspectives.map((perspective, index) => <button key={perspective.label} type="button" aria-pressed={active === index} aria-controls={`perspective-step-${index}`} onClick={() => selectStage(index)}><span className="rp-selector-number">0{index + 1}</span><span>{perspective.shortLabel}</span></button>)}
        </div>
      </div>
      <div className="rp-steps">
        {perspectives.map((perspective, index) => <article className={`rp-step ${active === index ? 'is-active' : ''}`} id={`perspective-step-${index}`} key={perspective.label} ref={(element) => { articles.current[index] = element; }} aria-labelledby={`perspective-heading-${index}`}>
          <div className="rp-step-inner">
            <div className="rp-kicker"><perspective.icon size={21} strokeWidth={1.4} aria-hidden="true" /><span>{perspective.label}</span><span className="rp-step-number">0{index + 1}</span></div>
            <h3 id={`perspective-heading-${index}`}>{perspective.title}</h3>
            <p>{perspective.text}</p>
            <p className="rp-detail">{perspective.detail}</p>
            <a href={perspective.link} className="text-link">{perspective.linkLabel}<ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
