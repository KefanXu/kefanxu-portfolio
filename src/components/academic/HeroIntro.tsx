import { useRef } from 'react';
import { ArrowDown, ArrowUpRight, BookOpen, Github, Linkedin } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { personalInfo } from '../../data/portfolio';
import { HeroSculpture } from './HeroSculpture';
import './HeroIntro.css';

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroIntro() {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const sculptureY = useTransform(scrollYProgress, [0, 1], [0, 32]);

  return <section id="home" ref={section} className="intro section-shell" aria-labelledby="hero-title">
    <div className="intro-composition">
      <div className="intro-copy">
        <motion.p className="intro-identity eyebrow" initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>Kefan Xu <span aria-hidden="true">·</span> PhD student</motion.p>
        <motion.h1 id="hero-title" className="intro-title" aria-label="Designing for health and care." style={{ y: reducedMotion ? 0 : titleY }}>
          {[<>Designing</>, <>for <em>health</em></>, <>and care.</>].map((line, index) => <span className="intro-title-line" key={index} aria-hidden="true"><motion.span initial={reducedMotion ? false : { y: '112%', rotate: 2 }} animate={{ y: '0%', rotate: 0 }} transition={{ duration: 1.15, delay: 0.1 + index * 0.14, ease }}>{line}</motion.span></span>)}
        </motion.h1>
        <motion.div className="intro-research" initial={reducedMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease }}>
          <p className="intro-description">My research in human-computer interaction examines how sensing systems and personal data can support health management and caregiving.</p>
          <p className="intro-affiliation">Georgia Institute of Technology<span>Human-Centered Computing · Advised by Dr. Rosa I. Arriaga</span></p>
          <div className="intro-actions" aria-label="Contact and profile links">
            <a className="text-link intro-email-link" href="mailto:kefanxu@gatech.edu">Email <ArrowUpRight size={16} aria-hidden="true" /></a>
            <a className="intro-profile-link" href={personalInfo.social.scholar} target="_blank" rel="noopener noreferrer"><BookOpen size={14} aria-hidden="true" />Google Scholar<ArrowUpRight size={13} aria-hidden="true" /></a>
            <a className="intro-profile-link" href={personalInfo.social.github} target="_blank" rel="noopener noreferrer"><Github size={14} aria-hidden="true" />GitHub<ArrowUpRight size={13} aria-hidden="true" /></a>
            <a className="intro-profile-link" href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={14} aria-hidden="true" />LinkedIn<ArrowUpRight size={13} aria-hidden="true" /></a>
          </div>
        </motion.div>
      </div>

      <motion.figure className="intro-art" style={{ y: reducedMotion ? 0 : sculptureY }} initial={reducedMotion ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.2, ease }}>
        <HeroSculpture scrollProgress={scrollYProgress} />
        <figcaption>Care as a relationship between people, technology, and their environment.</figcaption>
      </motion.figure>
    </div>

    <div className="intro-foot">
      <p>Human-computer interaction <span aria-hidden="true">·</span> Health informatics <span aria-hidden="true">·</span> Personal informatics</p>
      <a href="#research">Research perspective <ArrowDown size={16} aria-hidden="true" /></a>
    </div>
  </section>;
}
