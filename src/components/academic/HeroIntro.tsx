import { ArrowDown, ArrowUpRight, BookOpen, Github, Linkedin } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';
import './HeroIntro.css';

export function HeroIntro() {
  return <section id="home" className="intro section-shell" aria-labelledby="hero-title">
    <div className="intro-composition">
      <div className="intro-topline">
        <p className="intro-identity eyebrow">Kefan Xu <span aria-hidden="true">·</span> PhD student</p>
        <p className="intro-discipline">Human-Centered Computing</p>
      </div>

      <h1 id="hero-title" className="intro-title" aria-label="Designing for health and care.">
        <span className="intro-title-line" aria-hidden="true"><span>Designing for</span></span>
        <span className="intro-title-line intro-title-care" aria-hidden="true"><span><em>health</em> <span className="intro-ampersand">&amp;</span> care.</span></span>
      </h1>

      <div className="intro-details">
        <p className="intro-description">My research in human-computer interaction examines how sensing systems and personal data can support health management and caregiving.</p>
        <div className="intro-context">
          <p className="intro-affiliation">Georgia Institute of Technology<span>Human-Centered Computing<br />Advised by Dr. Rosa I. Arriaga</span></p>
          <div className="intro-actions" aria-label="Contact and profile links">
            <a className="intro-profile-link intro-email-link" href="mailto:kefanxu@gatech.edu">Email<ArrowUpRight size={14} aria-hidden="true" /></a>
            <a className="intro-profile-link" href={personalInfo.social.scholar} target="_blank" rel="noopener noreferrer"><BookOpen size={14} aria-hidden="true" />Google Scholar<ArrowUpRight size={13} aria-hidden="true" /></a>
            <a className="intro-profile-link" href={personalInfo.social.github} target="_blank" rel="noopener noreferrer"><Github size={14} aria-hidden="true" />GitHub<ArrowUpRight size={13} aria-hidden="true" /></a>
            <a className="intro-profile-link" href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={14} aria-hidden="true" />LinkedIn<ArrowUpRight size={13} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </div>

    <div className="intro-foot">
      <p>Human-computer interaction <span aria-hidden="true">·</span> Health informatics <span aria-hidden="true">·</span> Personal informatics</p>
      <a href="#research">Research perspective <ArrowDown size={16} aria-hidden="true" /></a>
    </div>
  </section>;
}
