import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { sizeOf } from '../data/img';
import type { Block, DemoId, Shot } from '../data/types';
import { CapsuleDemo } from '../demos/CapsuleDemo';
import { EcologyDemo } from '../demos/EcologyDemo';
import { LoopDemo } from '../demos/LoopDemo';
import { MoodDemo } from '../demos/MoodDemo';
import { onScrollFrame } from '../lib/scroll';
import { Browser, Phone } from './Device';
import { Zoom } from './Lightbox';
import { Reveal, SplitText, useRevealRef } from './Reveal';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const DEMOS: Record<DemoId, () => JSX.Element> = { capsules: CapsuleDemo, mood: MoodDemo, loop: LoopDemo, ecology: EcologyDemo };

function BlockHead({ eyebrow, title, intro }: { eyebrow?: string; title?: string; intro?: string }) {
  if (!eyebrow && !title) return null;
  return (
    <div className="block__head">
      {eyebrow ? <Reveal kind="fade" className="mono block__eyebrow">{eyebrow}</Reveal> : null}
      {title ? <SplitText as="h2" className="h2 block__title" text={title} /> : null}
      {intro ? <Reveal delay={160}><p className="body-l muted block__intro">{intro}</p></Reveal> : null}
    </div>
  );
}

/* ── Count-up number ───────────────────────────────────────────────────── */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [text, setText] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    const element = ref.current;
    if (!element || !match) return;
    const target = Number(match[2]);
    const decimals = (match[2].split('.')[1] ?? '').length;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setText(value); return; }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const duration = 1500;
      const tick = (now: number) => {
        const t = clamp((now - start) / duration);
        const eased = 1 - Math.pow(2, -10 * t);
        setText(`${match[1]}${(target * (t === 1 ? 1 : eased)).toFixed(decimals)}${match[3]}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(element);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref} aria-label={value}><span aria-hidden="true">{text}</span></span>;
}

/* ── Sequence: a pinned device whose screen follows the steps ──────────── */
function Sequence({ block }: { block: Extract<Block, { type: 'sequence' }> }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => onScrollFrame(({ vh }) => {
    const element = root.current;
    if (!element) return;
    const steps = Array.from(element.querySelectorAll<HTMLElement>('[data-step]'));
    let best = 0;
    let bestDistance = Infinity;
    steps.forEach((step, index) => {
      const bounds = step.getBoundingClientRect();
      const distance = Math.abs(bounds.top + bounds.height / 2 - vh * 0.5);
      if (distance < bestDistance) { bestDistance = distance; best = index; }
    });
    setActive(current => (current === best ? current : best));
    const bounds = element.getBoundingClientRect();
    element.style.setProperty('--seq', clamp((vh * 0.5 - bounds.top) / bounds.height).toFixed(4));
  }), []);

  const Frame = block.device === 'phone' ? Phone : Browser;
  return (
    <div ref={root} className={`sequence sequence--${block.device}`}>
      <div className="sequence__stage">
        <div className="sequence__pin">
          <Frame className="sequence__device">
            {block.steps.map((step, index) => (
              <img
                key={step.shot.src}
                src={step.shot.src}
                alt={step.shot.alt}
                aria-hidden={index === active ? undefined : true}
                className={`sequence__shot${index === active ? ' is-on' : ''}${index < active ? ' is-past' : ''}`}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ))}
          </Frame>
          <div className="sequence__meter" aria-hidden="true">
            <span className="mono">{String(active + 1).padStart(2, '0')}</span>
            <i><b /></i>
            <span className="mono">{String(block.steps.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
      <ol className="sequence__steps">
        {block.steps.map((step, index) => (
          <li key={step.title} data-step className={index === active ? 'is-on' : ''}>
            <span className="mono">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="h3">{step.title}</h3>
            <p className="body-l">{step.body}</p>
            <figure className="sequence__inline">
              {block.device === 'phone' ? <Phone shot={step.shot} /> : <Browser shot={step.shot} />}
            </figure>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Gallery strip: the page scroll pans it from its first item to its last ── */
function Strip({ shots, kind }: { shots: Shot[]; kind: 'phones' | 'posters' }) {
  // The strip reveals as one piece (items stagger in CSS), so items that start
  // off-screen to the right are already there when someone swipes to them.
  const root = useRevealRef<HTMLDivElement>();
  useEffect(() => onScrollFrame(({ vh }) => {
    const element = root.current;
    const track = element?.firstElementChild as HTMLElement | null;
    if (!element || !track) return;
    // Everything wider than the screen travels past while the strip crosses the
    // middle of the viewport, so a mouse never has to scroll sideways. (CSS only
    // applies the shift for fine pointers; touch keeps its native swipe.)
    const overflow = Math.max(0, track.offsetWidth - element.clientWidth);
    const bounds = element.getBoundingClientRect();
    const progress = clamp((vh * 0.58 - bounds.top) / (vh * 0.72));
    const eased = progress * progress * (3 - 2 * progress);
    element.style.setProperty('--shift', `${(-overflow * eased).toFixed(1)}px`);
  }), [root]);

  return (
    <div ref={root} className={`strip strip--${kind}${shots.length > 5 ? ' strip--long' : ''}`} data-lenis-prevent-touch>
      <ul className="strip__track">
        {shots.map((shot, index) => (
          <li key={shot.src} className="strip__item" style={{ '--i': Math.min(index, 6) } as CSSProperties}>
            <figure>
              {kind === 'phones' ? <Phone shot={shot} /> : <img className="strip__poster" src={shot.src} alt={shot.alt} {...sizeOf(shot.src)} loading="lazy" decoding="async" />}
              {shot.caption ? <figcaption className="mono">{shot.caption}</figcaption> : null}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── A tall artefact that pans inside a fixed window as the page scrolls ── */
function Pan({ shot }: { shot: Shot }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => onScrollFrame(({ vh }) => {
    const element = root.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    element.style.setProperty('--pan', clamp((vh * 0.85 - bounds.top) / (bounds.height + vh * 0.4)).toFixed(4));
  }), []);
  return (
    <div ref={root} className="pan">
      <img src={shot.src} alt={shot.alt} {...sizeOf(shot.src)} loading="lazy" decoding="async" />
    </div>
  );
}

function Video({ block }: { block: Extract<Block, { type: 'video' }> }) {
  const [playing, setPlaying] = useState(false);
  return (
    <Reveal kind="clip" className="video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${block.youtubeId}?autoplay=1&rel=0`}
          title={block.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video__poster" onClick={() => setPlaying(true)} data-cursor="Play film" aria-label={`Play: ${block.title}`}>
          <img src={block.poster} alt="" loading="lazy" decoding="async" />
          <span className="video__play" aria-hidden="true"><Play size={26} fill="currentColor" /></span>
        </button>
      )}
    </Reveal>
  );
}

export function CaseBlock({ block, soft }: { block: Block; soft: string }) {
  switch (block.type) {
    case 'text':
      return (
        <section className="block block--text shell">
          <BlockHead eyebrow={block.eyebrow} title={block.title} />
          <div className="block__columns">
            <div className="block__prose">
              {block.body.map((paragraph, index) => (
                <Reveal key={index} delay={index * 90}><p className={index === 0 ? 'lede' : 'body-l muted'}>{paragraph}</p></Reveal>
              ))}
            </div>
            {block.aside ? (
              <Reveal delay={200} className="block__aside">
                {block.aside.map(group => (
                  <div key={group.label}>
                    <span className="mono">{group.label}</span>
                    <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
                  </div>
                ))}
              </Reveal>
            ) : null}
          </div>
        </section>
      );

    case 'sequence':
      return (
        <section className="block block--sequence shell">
          <BlockHead eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <Sequence block={block} />
        </section>
      );

    case 'gallery':
      return (
        <section className={`block block--gallery${block.title ? '' : ' block--tight'}`}>
          <div className="shell"><BlockHead eyebrow={block.eyebrow} title={block.title} intro={block.intro} /></div>
          {block.kind === 'wide' ? (
            <ul className="tiles shell">
              {block.shots.map((shot, index) => (
                <li key={shot.src}>
                  <Reveal kind="clip" delay={(index % 2) * 120} className="tiles__frame" style={{ background: soft }}>
                    <Zoom shot={shot}><img src={shot.src} alt={shot.alt} {...sizeOf(shot.src)} loading="lazy" decoding="async" /></Zoom>
                  </Reveal>
                  {shot.caption ? <Reveal kind="fade" delay={200}><p className="tiles__caption">{shot.caption}</p></Reveal> : null}
                </li>
              ))}
            </ul>
          ) : (
            <Strip shots={block.shots} kind={block.kind} />
          )}
          {block.note ? <p className="shell block__note muted">{block.note}</p> : null}
        </section>
      );

    case 'figure':
      return (
        <section className={`block block--figure shell${block.title ? '' : ' block--tight'}`}>
          <BlockHead eyebrow={block.eyebrow} title={block.title} />
          <figure className={`figure figure--${block.frame}${block.wide ? ' figure--wide' : ''}`}>
            <Reveal kind="clip" className="figure__frame" style={{ '--soft': soft } as CSSProperties}>
              {block.frame === 'browser' ? <div className="zoom-host"><Browser shot={block.shot} /><Zoom shot={block.shot} /></div> : null}
              {block.frame === 'phone' ? <Phone shot={block.shot} /> : null}
              {block.frame === 'pan' ? <Pan shot={block.shot} /> : null}
              {block.frame === 'plain' || block.frame === 'card'
                ? <Zoom shot={block.shot}><img src={block.shot.src} alt={block.shot.alt} {...sizeOf(block.shot.src)} loading="lazy" decoding="async" /></Zoom>
                : null}
            </Reveal>
            {block.shot.caption ? <Reveal kind="fade" delay={160}><figcaption>{block.shot.caption}</figcaption></Reveal> : null}
          </figure>
        </section>
      );

    case 'insights':
      return (
        <section className="block block--insights shell">
          <BlockHead eyebrow={block.eyebrow} title={block.title} />
          <ol className="insights">
            {block.items.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 110} className="insights__card" style={{ background: soft }}>
                <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="h3">{item.title}</h3>
                <p>{item.body}</p>
              </Reveal>
            ))}
          </ol>
          {block.note ? <Reveal kind="fade"><p className="block__note muted">{block.note}</p></Reveal> : null}
        </section>
      );

    case 'identity':
      return (
        <section className="block block--identity shell">
          <BlockHead eyebrow={block.eyebrow} title={block.title} />
          <div className="identity">
            <div className="identity__text">
              <Reveal><p className="lede">{block.body}</p></Reveal>
              <ul className="swatches">
                {block.swatches.map((swatch, index) => (
                  <Reveal as="li" key={swatch.hex} delay={index * 80}>
                    <i style={{ background: swatch.hex }} />
                    <span>{swatch.name}</span>
                    <span className="mono">{swatch.hex.toUpperCase()}</span>
                    <span className="mono muted">{swatch.role}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
            <ul className="identity__marks">
              {block.marks.map((mark, index) => (
                <Reveal as="li" key={mark.src} kind="scale" delay={index * 120} className={`identity__mark identity__mark--${index}`} style={{ background: soft }}>
                  {index === 0
                    ? <img src={mark.src} alt={mark.alt} {...sizeOf(mark.src)} loading="lazy" decoding="async" />
                    : <Zoom shot={mark}><img src={mark.src} alt={mark.alt} {...sizeOf(mark.src)} loading="lazy" decoding="async" /></Zoom>}
                  {mark.caption ? <span className="mono">{mark.caption}</span> : null}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      );

    case 'demo': {
      const Demo = DEMOS[block.demo];
      return (
        <section className="block block--demo shell">
          <div className="block__columns block__columns--demo">
            <BlockHead eyebrow={block.eyebrow} title={block.title} />
            <Reveal delay={140}><p className="body-l muted">{block.body}</p></Reveal>
          </div>
          <Reveal kind="scale" className="demo-wrap">
            <Demo />
            {block.hint ? <span className="demo-hint mono" aria-hidden="true"><i />Live · {block.hint}</span> : null}
          </Reveal>
        </section>
      );
    }

    case 'video':
      return (
        <section className="block block--video shell">
          <BlockHead eyebrow={block.eyebrow} title={block.title} />
          <Video block={block} />
          <p className="block__note muted">{block.caption}</p>
        </section>
      );

    case 'outcome':
      return (
        <section className="block block--outcome shell">
          <BlockHead eyebrow={block.eyebrow} title={block.title} />
          <div className="block__columns">
            <div className="block__prose">
              {block.body.map((paragraph, index) => <Reveal key={index} delay={index * 90}><p className={index === 0 ? 'lede' : 'body-l muted'}>{paragraph}</p></Reveal>)}
              {block.links.length ? (
                <Reveal delay={160} className="block__links">
                  {block.links.map(item => (
                    <a key={item.href} className="btn btn--ghost" href={item.href} target="_blank" rel="noopener noreferrer">{item.label} <ArrowUpRight size={18} aria-hidden="true" /></a>
                  ))}
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>
      );
  }
}
