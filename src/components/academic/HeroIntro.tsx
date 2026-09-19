import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, BookOpen, Github, Linkedin } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';
import { Reveal } from '../../design/components/Reveal';
import { onScrollFrame } from '../../design/lib/scroll';
import { useMagnetic } from './motion';
import { Words } from './Words';
import './HeroIntro.css';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function HeroIntro() {
  const section = useRef<HTMLElement>(null);
  const scrollHint = useMagnetic<HTMLAnchorElement>(0.2);

  useEffect(() => onScrollFrame(({ y, vh }) => {
    // 0 at the top of the page, 1 once the introduction has scrolled away.
    section.current?.style.setProperty('--hp', clamp(y / (vh * 0.9)).toFixed(4));
  }), []);

  return <section ref={section} id="home" className="intro section-shell" aria-labelledby="hero-title">
    <div className="intro-composition">
      <Reveal kind="fade" delay={60} className="intro-topline">
        <p className="intro-identity eyebrow">Kefan Xu <span aria-hidden="true">·</span> PhD student</p>
        <p className="intro-discipline">Human-Centered Computing</p>
      </Reveal>

      <Words as="h1" id="hero-title" className="intro-title" delay={140} text="Designing for | *health* & care." />

      <div className="intro-details">
        <Reveal as="p" className="intro-description" delay={560}>My research in human-computer interaction examines how sensing systems and personal data can support health management and caregiving.</Reveal>
        <Reveal className="intro-context" delay={680}>
          <p className="intro-affiliation">Georgia Institute of Technology<span>Human-Centered Computing<br />Advised by Dr. Rosa I. Arriaga</span></p>
          <div className="intro-actions" aria-label="Contact and profile links">
            <a className="intro-profile-link intro-email-link" href="mailto:kefanxu@gatech.edu">Email<ArrowUpRight size={14} aria-hidden="true" /></a>
            <a className="intro-profile-link" href={personalInfo.social.scholar} target="_blank" rel="noopener noreferrer"><BookOpen size={14} aria-hidden="true" />Google Scholar<ArrowUpRight size={13} aria-hidden="true" /></a>
            <a className="intro-profile-link" href={personalInfo.social.github} target="_blank" rel="noopener noreferrer"><Github size={14} aria-hidden="true" />GitHub<ArrowUpRight size={13} aria-hidden="true" /></a>
            <a className="intro-profile-link" href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={14} aria-hidden="true" />LinkedIn<ArrowUpRight size={13} aria-hidden="true" /></a>
          </div>
        </Reveal>
      </div>
    </div>

    <Reveal kind="fade" delay={900} className="intro-foot">
      <p>Human-computer interaction <span aria-hidden="true">·</span> Health informatics <span aria-hidden="true">·</span> Personal informatics</p>
      <a ref={scrollHint} href="#research">Research perspective <ArrowDown size={16} aria-hidden="true" /></a>
    </Reveal>
  </section>;
}
