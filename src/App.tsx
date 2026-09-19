import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen } from 'lucide-react';
import { motion, MotionConfig, useScroll } from 'framer-motion';
import { HeroIntro } from './components/academic/HeroIntro';
import { About } from './components/academic/About';
import { ResearchPractice } from './components/academic/ResearchPractice';
import { ResearchGallery } from './components/academic/ResearchGallery';
import { Publications } from './components/academic/Publications';
import { ResearchPerspective } from './components/academic/ResearchPerspective';
import { Words } from './components/academic/Words';
import { useMagnetic } from './components/academic/motion';
import { Cursor } from './design/components/Cursor';
import { Reveal, setRevealGate } from './design/components/Reveal';
import { reducedMotion, scrollToElement, startScroll } from './design/lib/scroll';
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
  const cvLink = useMagnetic<HTMLAnchorElement>(0.2);
  const backToTop = useMagnetic<HTMLAnchorElement>(0.24);
  const { scrollYProgress: pageProgress } = useScroll();

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
    // Smooth scrolling and the shared frame loop behind every scroll-linked
    // piece. Entrances wait for the web fonts (briefly) so words are not
    // revealed in a fallback face and then reflowed.
    const stopScroll = startScroll();
    let opened = false;
    const openGate = () => { if (!opened) { opened = true; setRevealGate(true); } };
    const timer = window.setTimeout(openGate, 700);
    document.fonts?.ready.then(openGate);
    return () => { window.clearTimeout(timer); stopScroll(); };
  }, []);

  useEffect(() => {
    // In-page links glide to their section instead of jumping. Keyboard
    // activation keeps the native anchor behaviour, which also moves the
    // sequential-focus starting point; reader links are handled by the gallery.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.detail === 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link || link.classList.contains('skip-link') || reducedMotion()) return;
      const id = link.getAttribute('href')!.slice(1);
      if (!id || id.includes('/')) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      if (window.location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
      // A link in the open phone menu closes it, and the collapsing menu pulls
      // everything below up by its height; aim at where the section will land.
      const menuHeight = document.querySelector('.mobile-nav')?.getBoundingClientRect().height ?? 0;
      scrollToElement(target, -menuHeight);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
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

  const closeMenuFromLink = () => {
    setMenuOpen(false);
    menuButton.current?.focus({ preventScroll: true });
  };

  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <motion.div className="reading-progress" aria-hidden="true" initial={false} style={{ scaleX: pageProgress }} />
      <div className="header-inner">
        <a className="wordmark" href="#home" aria-label="Kefan Xu, home" onClick={() => { setMenuOpen(false); setActiveSection(''); }}><img src={clover} alt="" width="32" height="32" />Kefan Xu<span className="wordmark-dot">.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}</nav>
        <a ref={cvLink} className="cv-link" href={cvPdf} target="_blank" rel="noopener noreferrer">Curriculum vitae <ArrowUpRight size={16} /></a>
        <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(open => !open)}>
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
      <div className={`mobile-nav-shell ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          <div className="mobile-nav-list">
            {navigation.map(({ id, label }) => <a key={id} href={`#${id}`} tabIndex={menuOpen ? undefined : -1} onClick={closeMenuFromLink}>{label}<ArrowUpRight size={18} /></a>)}
            <a href={cvPdf} target="_blank" rel="noopener noreferrer" tabIndex={menuOpen ? undefined : -1} onClick={closeMenuFromLink}>Curriculum vitae<ArrowUpRight size={18} /></a>
          </div>
        </nav>
      </div>
    </header>
    <main id="main">
      <HeroIntro />
      <About />
      <ResearchPerspective />
      <ResearchGallery />
      <ResearchPractice />
      <Publications />
      <footer id="contact" className="contact-footer"><div className="section-shell">
        <div className="footer-main"><div><Reveal as="p" kind="fade" className="eyebrow">CONTACT</Reveal><Words as="h2" text="Research inquiries | & *collaboration.*" /></div><Reveal className="footer-contact" delay={220}><a className="email-link" href="mailto:kefanxu@gatech.edu">kefanxu@gatech.edu <ArrowUpRight size={24} /></a><p>Human-Centered Computing · Georgia Tech</p><div className="social-links"><a href={personalInfo.social.scholar} target="_blank" rel="noopener noreferrer"><BookOpen size={16} />Google Scholar<ArrowUpRight size={14} /></a><a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<ArrowUpRight size={14} /></a><a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRight size={14} /></a></div></Reveal></div>
        <div className="footer-bottom"><a className="wordmark" href="#home">Kefan Xu<span className="wordmark-dot">.</span></a><span>© {new Date().getFullYear()} Kefan Xu · Atlanta, GA</span><a ref={backToTop} href="#home">Back to top <ArrowRight className="back-top-icon" size={16} /></a></div>
      </div></footer>
    </main>
    <Cursor />
  </MotionConfig>;
}
export default App;
