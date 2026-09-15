import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Menu, X } from 'lucide-react';
import { motion, MotionConfig, useReducedMotion, useScroll } from 'framer-motion';
import { HeroIntro } from './components/academic/HeroIntro';
import { About } from './components/academic/About';
import { ResearchPractice } from './components/academic/ResearchPractice';
import { ResearchGallery } from './components/academic/ResearchGallery';
import { Publications } from './components/academic/Publications';
import { ResearchPerspective } from './components/academic/ResearchPerspective';
import { personalInfo } from './data/portfolio';
import { projectCaseStudies } from './data/projectCaseStudies';
import cvPdf from './assets/KefanXu_CV.pdf';
import clover from './assets/clover.svg';

const navigation = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'practice', label: 'Practice' },
  { id: 'publications', label: 'Publications' },
];

// Run before React renders so browser restoration cannot paint a stale section
// position first. Valid project-reader URLs are the only deep links preserved.
const initialProjectRoute = projectCaseStudies.some(project => window.location.hash === `#project/${project.id}`);
const nativeScrollRestoration = history.scrollRestoration;
const nativeInlineScrollBehavior = document.documentElement.style.scrollBehavior;
if (!initialProjectRoute) {
  history.scrollRestoration = 'manual';
  if (window.location.hash) {
    history.replaceState(history.state, '', `${window.location.pathname}${window.location.search}`);
  }
  const root = document.documentElement;
  root.style.scrollBehavior = 'auto';
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress: pageProgress } = useScroll();
  const ease = [0.22, 1, 0.36, 1] as const;

  useLayoutEffect(() => {
    // A normal visit always starts at the introduction. Clear a section hash
    // left by an earlier visit before the browser can restore that position;
    // direct project-reader URLs remain available for sharing.
    if (initialProjectRoute) return;
    const previousRestoration = nativeScrollRestoration;
    history.scrollRestoration = 'manual';
    const alignToTop = () => {
      const root = document.documentElement;
      root.style.scrollBehavior = 'auto';
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    alignToTop();
    const frame = requestAnimationFrame(alignToTop);
    let restorationIsActive = true;
    const restoreNativeScrolling = () => {
      if (!restorationIsActive) return;
      restorationIsActive = false;
      document.documentElement.style.scrollBehavior = nativeInlineScrollBehavior;
      history.scrollRestoration = previousRestoration;
    };
    let restorationFrame = 0;
    const scheduleNativeScrolling = () => {
      cancelAnimationFrame(restorationFrame);
      restorationFrame = requestAnimationFrame(restoreNativeScrolling);
    };
    const onInitialPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted && !window.location.hash) alignToTop();
      scheduleNativeScrolling();
    };
    window.addEventListener('pageshow', onInitialPageShow, { once: true });
    const readyFrame = document.readyState === 'complete'
      ? requestAnimationFrame(() => { alignToTop(); scheduleNativeScrolling(); })
      : 0;
    return () => {
      cancelAnimationFrame(frame);
      if (readyFrame) cancelAnimationFrame(readyFrame);
      cancelAnimationFrame(restorationFrame);
      window.removeEventListener('pageshow', onInitialPageShow);
      restoreNativeScrolling();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    let frame = 0;
    const updateReadingPosition = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      const headerHeight = document.querySelector('.header-inner')?.getBoundingClientRect().height ?? 90;
      const anchor = headerHeight + Math.min(180, window.innerHeight * 0.2);
      const current = ['home', ...navigation.map(item => item.id), 'contact'].find(id => {
        const bounds = document.getElementById(id)?.getBoundingClientRect();
        return bounds && bounds.top <= anchor && bounds.bottom > anchor;
      });
      setActiveSection(current && current !== 'home' && current !== 'contact' ? current : '');
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateReadingPosition); };
    updateReadingPosition();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <motion.div className="reading-progress" aria-hidden="true" initial={false} style={{ scaleX: pageProgress }} />
      <div className="header-inner">
        <a className="wordmark" href="#home" aria-label="Kefan Xu, home" onClick={() => { setMenuOpen(false); setActiveSection(''); }}><img src={clover} alt="" width="32" height="32" />Kefan Xu<span className="wordmark-dot">.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}</nav>
        <a className="cv-link" href={cvPdf} target="_blank" rel="noopener noreferrer">Curriculum vitae <ArrowUpRight size={16} /></a>
        <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}>{navigation.map(({ id, label }) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={18} /></a>)}<a href={cvPdf} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Curriculum vitae<ArrowUpRight size={18} /></a></nav>
    </header>
    <main id="main">
      <HeroIntro />
      <About />
      <ResearchPerspective />
      <ResearchGallery />
      <ResearchPractice />
      <Publications />
      <footer id="contact" className="contact-footer"><div className="section-shell">
        <motion.div className="footer-main" initial={reducedMotion ? false : { opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 1, ease }}><div><p className="eyebrow">CONTACT</p><h2>Research inquiries<br />&amp; <em>collaboration.</em></h2></div><div className="footer-contact"><a className="email-link" href="mailto:kefanxu@gatech.edu">kefanxu@gatech.edu <ArrowUpRight size={24} /></a><p>Human-Centered Computing · Georgia Tech</p><div className="social-links"><a href={personalInfo.social.scholar} target="_blank" rel="noopener noreferrer"><BookOpen size={16} />Google Scholar<ArrowUpRight size={14} /></a><a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<ArrowUpRight size={14} /></a><a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRight size={14} /></a></div></div></motion.div>
        <div className="footer-bottom"><a className="wordmark" href="#home">Kefan Xu<span className="wordmark-dot">.</span></a><span>© {new Date().getFullYear()} Kefan Xu · Atlanta, GA</span><a href="#home">Back to top <ArrowRight className="back-top-icon" size={16} /></a></div>
      </div></footer>
    </main>
  </MotionConfig>;
}
export default App;
