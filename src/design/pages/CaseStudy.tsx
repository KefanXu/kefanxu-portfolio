import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CaseBlock, CountUp } from '../components/Blocks';
import { Cover } from '../components/Covers';
import { Browser, Phone } from '../components/Device';
import { Reveal, SplitText } from '../components/Reveal';
import { projects } from '../data/projects';
import type { Project } from '../data/types';
import { homeHref, useRouter, workHref } from '../lib/router';
import { onScrollFrame } from '../lib/scroll';
import { Contact } from './Home';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function CaseHero({ project, index }: { project: Project; index: number }) {
  const stage = useRef<HTMLDivElement>(null);
  const { link } = useRouter();

  useEffect(() => onScrollFrame(({ vh }) => {
    const element = stage.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    element.style.setProperty('--sp', clamp((vh - bounds.top) / (vh + bounds.height)).toFixed(4));
  }), []);

  return (
    <header className="case-hero">
      <div className="shell">
        <Reveal kind="fade" className="case-hero__crumbs mono">
          <a className="link" href={homeHref} onClick={link(homeHref, { section: 'work' })}><ArrowLeft size={14} aria-hidden="true" /> All work</a>
          <span>Case study {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
          <span className="case-hero__kicker">{project.kicker}</span>
        </Reveal>

        <SplitText as="h1" className="display case-hero__name" text={project.name} delay={80} />
        <div className="case-hero__intro">
          <SplitText as="p" className="h3 case-hero__headline" text={project.headline} delay={260} />
          <Reveal delay={420}><p className="body-l muted">{project.summary}</p></Reveal>
        </div>

        <Reveal as="dl" delay={520} className="case-hero__meta">
          {project.meta.map(item => (
            <div key={item.label}>
              <dt className="mono">{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </Reveal>
      </div>

      <div className="shell">
        <Reveal kind="clip" delay={300} className={`case-hero__stage case-hero__stage--${project.heroDevice}${project.theme.dark ? ' is-dark' : ''}`}>
          <div ref={stage} className="case-hero__canvas" style={{ background: project.theme.panel, color: project.theme.ink }}>
            {project.heroDevice === 'phone' ? (
              <div className="case-hero__phones">
                {project.heroShots.map((shot, shotIndex) => (
                  <Phone key={shot.src} shot={shot} eager className={`case-hero__phone case-hero__phone--${shotIndex}`} />
                ))}
              </div>
            ) : (
              <>
                <div className="case-hero__backdrop" aria-hidden="true"><Cover id={project.cover} /></div>
                <Browser shot={project.heroShots[0]} eager url={project.slug} className="case-hero__browser" />
              </>
            )}
          </div>
        </Reveal>
      </div>

      <dl className="shell case-hero__stats">
        {project.stats.map((stat, statIndex) => (
          <Reveal key={stat.label} delay={statIndex * 90} className="case-hero__stat">
            <dt><CountUp value={stat.value} /></dt>
            <dd className="mono">{stat.label}</dd>
          </Reveal>
        ))}
      </dl>
    </header>
  );
}

function NextProject({ project, index }: { project: Project; index: number }) {
  const { link } = useRouter();
  const href = workHref(project.slug);
  return (
    <section className="next shell" aria-label="Next case study">
      <a
        className={`next__card${project.theme.dark ? ' next__card--dark' : ''}`}
        href={href}
        onClick={link(href)}
        data-cursor="Next case"
        data-cover-host
        style={{ '--panel': project.theme.panel, '--panel-ink': project.theme.ink } as CSSProperties}
      >
        <div className="next__text">
          <span className="mono">Next — {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
          <span className="display next__name">{project.name}</span>
          <span className="next__go">{project.kicker} <ArrowRight size={20} aria-hidden="true" /></span>
        </div>
        <div className="next__visual"><Cover id={project.cover} /></div>
      </a>
    </section>
  );
}

export function CaseStudy({ slug }: { slug: string }) {
  const index = Math.max(0, projects.findIndex(project => project.slug === slug));
  const project = projects[index];
  const nextIndex = (index + 1) % projects.length;
  const article = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  // Reading progress: full once the next-project card reaches mid-screen.
  useEffect(() => onScrollFrame(({ y, vh }) => {
    const next = article.current?.querySelector<HTMLElement>('.next');
    const end = next ? next.getBoundingClientRect().top + y - vh * 0.5 : document.documentElement.scrollHeight - vh;
    progress.current?.style.setProperty('--p', Math.min(1, Math.max(0, y / Math.max(1, end))).toFixed(4));
  }), []);

  return (
    <article ref={article} className="case" style={{ '--accent': project.theme.accent, '--soft': project.theme.dark ? '#ecefe8' : project.theme.soft } as CSSProperties}>
      <div ref={progress} className="case-progress" aria-hidden="true"><i /></div>
      <CaseHero project={project} index={index} />
      {project.blocks.map((block, blockIndex) => (
        <CaseBlock key={`${project.slug}-${blockIndex}`} block={block} soft={project.theme.dark ? '#ecefe8' : project.theme.soft} name={project.name} />
      ))}
      <NextProject project={projects[nextIndex]} index={nextIndex} />
      <Contact />
    </article>
  );
}
