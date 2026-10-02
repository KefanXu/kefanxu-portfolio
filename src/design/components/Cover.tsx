import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { coverLines, coverNumbers, issue, phoneProducts, quotes, stickers, teasers, totals, type Sticker } from '../data/cover';
import { img } from '../data/img';
import { projects } from '../data/projects';
import { useRouter, workHref } from '../lib/router';
import { coarsePointer, onScrollFrame, reducedMotion } from '../lib/scroll';
import { CountUp } from './CountUp';
import { Browser, Phone } from './Device';
import { EcoCareWindow, MoodloopScreen, TrackyaScreen } from './LiveScreens';
import { Magnetic } from './Magnetic';
import { Poster } from './Poster';
import { useRevealRef } from './Reveal';
import './cover.css';

/*
 * The opening, set like the cover of a magazine. A nameplate-scale masthead,
 * cover lines down the left, four numerals down the right, and in the middle
 * a printed poster with eight stickers pinned on it: two working screens,
 * a deployment calendar, an interview card, a component sheet, a deploy log,
 * a paper and a release badge. Each sticker is numbered and credited in the
 * band underneath, tagged with the stage of the work it stands for. The
 * stickers are printed in grey until the pointer reaches them.
 */
const ROTATE_MS = 11000;
const QUOTE_MS = 7000;
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const nightNow = () => { const hour = new Date().getHours(); return hour >= 20 || hour < 6; };

/** Counts 0…steps while `on`, holds at the end, then starts over; shows the whole thing when off. */
function useLoop(on: boolean, steps: number, ms: number, hold: number) {
  const [count, setCount] = useState(steps);
  useEffect(() => {
    if (!on || reducedMotion()) { setCount(steps); return; }
    let id = 0;
    const tick = (next: number) => {
      setCount(next);
      id = window.setTimeout(() => tick(next >= steps ? 0 : next + 1), next >= steps ? hold : ms);
    };
    // Begin full, so a return to the page never shows an empty card, then start the count.
    id = window.setTimeout(() => tick(0), hold);
    return () => window.clearTimeout(id);
  }, [on, steps, ms, hold]);
  return count;
}

/* ── Stickers drawn in code ────────────────────────────────────────────── */
const REVIEW_DAYS = new Set([0, 6, 13, 20, 27, 34, 41]);

function Calendar({ live }: { live: boolean }) {
  const day = useLoop(live, 42, 170, 3200);
  return (
    <div className="stk stk--calendar">
      <div className="stk__row"><span className="stk__cap">Moodloop · 42 days</span><span className="stk__cap">15 people</span></div>
      <div className="calendar__grid" aria-hidden="true">
        {Array.from({ length: 42 }, (_, i) => (
          <i key={i} className={`${i < day ? 'is-on' : ''}${i >= 21 ? ' is-p2' : ''}${REVIEW_DAYS.has(i) ? ' is-review' : ''}`} />
        ))}
      </div>
      <div className="stk__row"><span className="stk__cap">numbers → annotations</span><span className="stk__cap">{Math.min(594, Math.round((day / 42) * 594))} reports</span></div>
    </div>
  );
}

const LOG = ['$ vercel --prod', '▲ building care-work · react 18 · vite', '✓ Production  care-work.vercel.app', '/api/chat → deepseek-chat · temp 0.3'];
function Terminal({ live }: { live: boolean }) {
  const shown = useLoop(live, LOG.length, 1100, 4200);
  return (
    <div className="stk stk--terminal" aria-hidden="true">
      <span className="terminal__dots"><i /><i /><i /></span>
      {LOG.map((line, i) => (
        <div key={line} className={`terminal__line${i < shown ? ' is-on' : ''}${i === 2 ? ' is-ok' : ''}${i === 0 ? ' is-cmd' : ''}`}>{line}</div>
      ))}
      <i className={`terminal__caret${shown < LOG.length ? ' is-blinking' : ''}`} />
    </div>
  );
}

function Paper() {
  return (
    <div className="stk stk--paper" aria-hidden="true">
      <h4>Understanding the effect of reflective iteration on physical activity planning</h4>
      <div className="paper__au">Xu · Yan · Ryu · Newman · Arriaga</div>
      <div className="paper__cols"><div>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div><div>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div></div>
      <span className="paper__tag">CHI 2024</span>
    </div>
  );
}

function Badge() {
  return (
    <div className="stk stk--badge" aria-hidden="true">
      <span>Shipped · TestFlight</span><b>16</b><span>phones</span>
    </div>
  );
}

function Sheet() {
  return (
    <div className="stk stk--figma" aria-hidden="true">
      <div className="stk__row figma__bar"><span className="stk__cap">Trackya · components</span><span className="stk__cap">Figma</span></div>
      <div className="figma__sheet"><img src={img('trackya/styleguide.webp')} alt="" loading="lazy" decoding="async" draggable={false} /></div>
    </div>
  );
}

function Quote({ index }: { index: number }) {
  const quote = quotes[index];
  return (
    <blockquote className="stk stk--quote" key={index}>
      <p>“{quote.text}”</p>
      <footer className="stk__row"><span className="stk__cap">{quote.who}</span><span className="stk__cap">{quote.of}</span></footer>
    </blockquote>
  );
}

function Barcode() {
  const bars = [2, 1, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3];
  let x = 0;
  return (
    <svg className="opening__barcode" viewBox="0 0 106 30" aria-hidden="true">
      {bars.map((w, i) => { const rect = <rect key={i} x={x} width={w} height="24" />; x += w + 2; return rect; })}
      <text x="0" y="30">2021 — 2026 · 06 · 01</text>
    </svg>
  );
}

/* ── The cover ─────────────────────────────────────────────────────────── */
export function Cover() {
  const root = useRevealRef<HTMLElement>(false);
  const stage = useRef<HTMLDivElement>(null);
  const { link } = useRouter();
  const [hot, setHot] = useState<number | null>(null);
  const [product, setProduct] = useState(0);
  const [held, setHeld] = useState(false);
  const [quote, setQuote] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const [autoNight, setAutoNight] = useState(false);
  const [night, setNight] = useState<boolean | null>(null);
  const isNight = night ?? autoNight;

  // Is the cover on screen? The screens and loops only run while it is.
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    setHoverable(!coarsePointer());
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    io.observe(element);
    return () => io.disconnect();
  }, [root]);

  // After dark where the visitor is, the poster switches to night; checked each minute.
  useEffect(() => {
    setAutoNight(nightNow());
    const id = window.setInterval(() => setAutoNight(nightNow()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  // The phone alternates products and the interview card turns, until someone takes hold of anything.
  useEffect(() => {
    if (held || !visible || reducedMotion()) return;
    const id = window.setTimeout(() => setProduct(i => (i + 1) % phoneProducts.length), ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [product, held, visible]);
  useEffect(() => {
    if (held || !visible || reducedMotion()) return;
    const id = window.setTimeout(() => setQuote(i => (i + 1) % quotes.length), QUOTE_MS);
    return () => window.clearTimeout(id);
  }, [quote, held, visible]);

  // As the page scrolls away: the cover lifts (--hp, over most of a screen) and the
  // stickers, spread out at rest, gather onto the plate (--gp, over half a screen).
  useEffect(() => onScrollFrame(({ y, vh }) => {
    const element = root.current;
    if (!element) return;
    element.style.setProperty('--hp', clamp(y / (vh * 0.9)).toFixed(4));
    element.style.setProperty('--gp', clamp(y / (vh * 0.55)).toFixed(4));
  }), [root]);

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const target = stage.current;
    if (!target || coarsePointer()) return;
    const bounds = target.getBoundingClientRect();
    target.style.setProperty('--px', (clamp((event.clientX - bounds.left) / bounds.width, -0.5, 1.5) * 2 - 1).toFixed(3));
    target.style.setProperty('--py', (clamp((event.clientY - bounds.top) / bounds.height, -0.5, 1.5) * 2 - 1).toFixed(3));
  };
  const onPointerLeave = () => {
    stage.current?.style.setProperty('--px', '0');
    stage.current?.style.setProperty('--py', '0');
  };

  const hold = () => setHeld(true);
  const current = phoneProducts[product];
  const Screen = current.id === 'trackya' ? TrackyaScreen : MoodloopScreen;
  const nameOf = (slug: string) => projects.find(project => project.slug === slug)?.name ?? slug;

  /** The credit as it reads right now: the phone's and the interview card's follow what they show. */
  const creditOf = (sticker: Sticker) => {
    if (sticker.id === 'phone') return { credit: current.credit, slug: current.slug };
    if (sticker.id === 'quote') return { credit: quotes[quote].credit, slug: quotes[quote].slug };
    return { credit: sticker.credit, slug: sticker.slug };
  };

  const hover = (n: number) => ({ onMouseEnter: () => setHot(n), onMouseLeave: () => setHot(current => (current === n ? null : current)), onFocus: () => setHot(n), onBlur: () => setHot(current => (current === n ? null : current)) });

  /** One sticker: the visual, and a numbered mark that is the link to its case study. */
  const sticker = (id: Sticker['id'], depth: number, body: ReactNode, live = false) => {
    const item = stickers.find(entry => entry.id === id)!;
    const { credit, slug } = creditOf(item);
    const href = workHref(slug);
    const label = `${credit} — open ${nameOf(slug)}`;
    const inner = live ? <div className="sticker__body">{body}</div> : <a className="sticker__body" href={href} onClick={link(href)} aria-label={label}>{body}</a>;
    return (
      <div className={`sticker sticker--${id}${hot === item.n ? ' is-hot' : ''}`} style={{ '--i': item.n, '--depth': depth } as CSSProperties} {...hover(item.n)}>
        {inner}
        <a className="sticker__mark mono" href={href} onClick={link(href)} aria-label={label}>{item.n}</a>
      </div>
    );
  };

  const first = projects[0];
  const firstHref = workHref(first.slug);

  return (
    // The reveal system toggles `is-in` on the section itself, so React leaves that class list alone:
    // state-driven classes go on the shell inside.
    <section ref={root} className="opening" id="top" aria-labelledby="cover-title" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className={`shell opening__shell${hoverable ? ' is-hover' : ''}${isNight ? ' is-night' : ''}`}>
        <div className="opening__strap mono">
          <span><b>Issue {issue.number}</b> · {issue.season} · {issue.title}</span>
          <span>Six case studies · {issue.years}</span>
        </div>

        <h1 className="opening__mast" id="cover-title">
          <span className="opening__mast-word"><span>Kefan</span></span> <span className="opening__mast-word"><span>Xu</span></span>
          <span className="sr-only"> — health products that hold up in real life</span>
        </h1>

        <div className="opening__body">
          {/* cover lines */}
          <div className="opening__lines">
            <span className="opening__issue opening__in mono" style={{ '--d': '900ms' } as CSSProperties}>Inside: six products, research to deployment</span>
            {coverLines.map((line, index) => {
              const parts = line.text.split('*');
              return (
                <a key={line.n} className="opening__line opening__in" style={{ '--d': `${1000 + index * 90}ms` } as CSSProperties} href="#/" onClick={link('#/', { section: 'work' })}>
                  <span className="mono">{line.n} · {line.kicker}</span>
                  <p>{parts.map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}</p>
                  <small>{line.sub}</small>
                </a>
              );
            })}
          </div>

          {/* the poster and its stickers */}
          <div ref={stage} className="opening__stage" style={{ '--px': 0, '--py': 0 } as CSSProperties}>
            <p className="sr-only">A flat, printed illustration of dusk in the field: a grainy sun setting behind five ridges of hills, wearing a dial of forty-two ticks for the six weeks of the longest study; thin clouds, a few birds, far trees, and grasses, cattails, leaves and seed heads in the foreground. After dark the sun becomes a moon and the stars come out.</p>
            <div className="opening__plate">
              <Poster />
              <button type="button" className="opening__daynight" onClick={() => setNight(!isNight)} aria-pressed={isNight} aria-label={isNight ? 'Switch the poster to day' : 'Switch the poster to night'}>
                {isNight ? <Sun size={13} strokeWidth={1.75} /> : <Moon size={13} strokeWidth={1.75} />}
              </button>
            </div>
            {sticker('figma', 0.5, <Sheet />)}
            {sticker('browser', 0.9, <Browser url="eco-care-bice.vercel.app"><EcoCareWindow live={visible} onTouch={hold} /></Browser>, true)}
            {sticker('quote', 0.7, <Quote index={quote} />)}
            {sticker('badge', 1.1, <Badge />)}
            {sticker('terminal', 0.8, <Terminal live={visible} />)}
            {sticker('paper', 0.4, <Paper />)}
            {sticker('phone', 1.3, <Phone><div key={current.id} className="hs-screen-in"><Screen live={visible} onTouch={hold} /></div></Phone>, true)}
            {sticker('calendar', 0.6, <Calendar live={visible} />)}
          </div>

          {/* numerals */}
          <div className="opening__nums">
            {coverNumbers.map((item, index) => (
              <div key={item.label} className="opening__num opening__in" style={{ '--d': `${1000 + index * 90}ms` } as CSSProperties}>
                <b><CountUp value={item.value} />{item.unit ? <i>{item.unit}</i> : null}</b>
                <span className="mono">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* the band: credits, the deck, the cover story */}
        <div className="opening__band opening__in" style={{ '--d': '1300ms' } as CSSProperties}>
          <div className="opening__credits">
            <div className="opening__lbl mono"><span>On the cover</span><span>Hover a number · click to open</span></div>
            <ol>
              {stickers.map(item => {
                const { credit, slug } = creditOf(item);
                const href = workHref(slug);
                return (
                  <li key={item.id} className={hot === item.n ? 'is-hot' : ''} {...hover(item.n)}>
                    <a href={href} onClick={link(href)}><span className="mono">{item.n}</span><span key={credit} className="opening__credit">{credit} <i className="mono">{item.stage}</i></span></a>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="opening__inside">
            <div className="opening__lbl mono"><span>Inside · six stories</span><span>{issue.years}</span></div>
            <ol>
              {projects.map((project, index) => {
                const href = workHref(project.slug);
                return (
                  <li key={project.slug}><a href={href} onClick={link(href)}><span className="mono">{String(index + 1).padStart(2, '0')}</span><span><b>{project.name}</b> — {teasers[project.slug]}</span></a></li>
                );
              })}
            </ol>
          </div>
          <div className="opening__plus">
            <span className="mono opening__plus-k">Plus · the cover story</span>
            <Magnetic>
              <a className="btn" href={firstHref} onClick={link(firstHref)}>Start with {first.name} <ArrowRight size={18} aria-hidden="true" /></a>
            </Magnetic>
            <div className="opening__totals mono">{totals.map(item => <span key={item.label}><b>{item.value}</b> {item.label}</span>)}</div>
            <div className="opening__colophon">
              <span className="mono">Issue {issue.number} · {issue.season}<br />Atlanta, GA</span>
              <Barcode />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
