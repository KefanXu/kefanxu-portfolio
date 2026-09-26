import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { AnnotatedScreen, Block, RecordView, TraceView } from '../data/types';
import { Scene } from './BuildScene';
import { Browser, Phone } from './Device';
import { Reveal, SplitText, useRevealRef } from './Reveal';
import './build.css';

type BuildBlock = Extract<Block, { type: 'build' }>;

const GAP = 14; // px between stacked labels
const sideOf = (c: { x: number; side?: 'left' | 'right' }) => c.side ?? (c.x < 50 ? 'left' : 'right');

/** Layout position of `el` inside `root`, ignoring transforms. */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

interface Layout { tops: number[]; lines: string[]; minHeight: number }

const PIN_R = 11; // px, half the pin
const BADGE_R = 10; // px, half the label's number badge

/**
 * Labels sit beside the device at the height of their pin, nudged apart when
 * two would overlap. Each leader leaves the pin's edge and arrives at the
 * label's number badge as one smooth curve with level tangents at both ends,
 * so every line in the figure is drawn the same way.
 */
function measure(stage: HTMLElement, screen: HTMLElement, labels: (HTMLElement | null)[], callouts: AnnotatedScreen['callouts']): Layout {
  const s = offsetWithin(screen, stage);
  const sw = screen.offsetWidth;
  const sh = screen.offsetHeight;
  const pins = callouts.map(c => ({ x: s.x + (c.x / 100) * sw, y: s.y + (c.y / 100) * sh }));
  const tops = new Array<number>(callouts.length).fill(0);
  const lines = new Array<string>(callouts.length).fill('');
  const stageH = stage.offsetHeight;
  let minHeight = 0;
  const r = (n: number) => Math.round(n * 10) / 10;
  (['left', 'right'] as const).forEach(side => {
    const order = callouts.map((_, i) => i).filter(i => sideOf(callouts[i]) === side && labels[i]).sort((a, b) => pins[a].y - pins[b].y);
    const heights = order.map(i => labels[i]!.offsetHeight);
    // wanted: centred on the pin; then resolve overlaps downwards, then pull back inside the stage
    const wanted = order.map((i, k) => pins[i].y - heights[k] / 2);
    const placed: number[] = [];
    order.forEach((_, k) => {
      const min = k === 0 ? 0 : placed[k - 1] + heights[k - 1] + GAP;
      placed.push(Math.max(wanted[k], min));
    });
    const overflow = placed.length ? placed[placed.length - 1] + heights[heights.length - 1] - stageH : 0;
    if (overflow > 0) {
      for (let k = placed.length - 1; k >= 0; k -= 1) {
        const max = k === placed.length - 1 ? stageH - heights[k] : placed[k + 1] - GAP - heights[k];
        placed[k] = Math.max(0, Math.min(placed[k], max));
      }
    }
    order.forEach((i, k) => {
      tops[i] = placed[k];
      const label = labels[i]!;
      const column = label.parentElement as HTMLElement;
      const l = offsetWithin(column, stage);
      minHeight = Math.max(minHeight, l.y + placed[k] + heights[k] + 4);
      // the badge sits at the label's top-left (left column: top-right); its centre is the anchor
      const badge = label.querySelector<HTMLElement>('.ann__index');
      const bx = badge ? l.x + (side === 'left' ? column.offsetWidth - badge.offsetWidth / 2 : badge.offsetLeft + badge.offsetWidth / 2) : l.x;
      const by = l.y + placed[k] + (badge ? badge.offsetTop + badge.offsetHeight / 2 : 10);
      const dir = side === 'left' ? -1 : 1;
      const sx = pins[i].x + dir * PIN_R;
      const ex = bx - dir * BADGE_R;
      const mx = (sx + ex) / 2;
      lines[i] = `M ${r(sx)} ${r(pins[i].y)} C ${r(mx)} ${r(pins[i].y)}, ${r(mx)} ${r(by)}, ${r(ex)} ${r(by)}`;
    });
  });
  return { tops, lines, minHeight };
}

function Annotated({ screen }: { screen: AnnotatedScreen }) {
  const figureRef = useRevealRef<HTMLElement>(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout>({ tops: [], lines: [], minHeight: 0 });
  const [live, setLive] = useState(false);
  const [hot, setHot] = useState<number | null>(null);
  const { callouts } = screen;

  useEffect(() => {
    const figure = figureRef.current;
    const stage = stageRef.current;
    const device = deviceRef.current;
    if (!figure || !stage || !device) return;
    const remeasure = () => {
      const el = device.querySelector<HTMLElement>(screen.device === 'phone' ? '.phone__screen' : '.browser__view');
      if (!el) return;
      setLayout(measure(stage, el, labelRefs.current, callouts));
    };
    remeasure();
    const resize = new ResizeObserver(remeasure);
    resize.observe(stage);
    device.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', remeasure, { once: true }); });
    document.fonts?.ready.then(remeasure).catch(() => undefined);
    const classes = new MutationObserver(() => { if (figure.classList.contains('is-in')) setLive(true); });
    classes.observe(figure, { attributes: true, attributeFilter: ['class'] });
    if (figure.classList.contains('is-in')) setLive(true);
    return () => { resize.disconnect(); classes.disconnect(); };
  }, [figureRef, screen, callouts]);

  const pins = callouts.map((c, i) => (
    <button
      key={i}
      type="button"
      className={`ann__pin${hot === i ? ' is-hot' : ''}`}
      style={{ left: `${c.x}%`, top: `${c.y}%`, '--i': i } as CSSProperties}
      aria-label={`${i + 1}: ${c.title}`}
      onMouseEnter={() => setHot(i)}
      onMouseLeave={() => setHot(null)}
      onFocus={() => setHot(i)}
      onBlur={() => setHot(null)}
    >
      {i + 1}
    </button>
  ));

  const column = (side: 'left' | 'right') => (
    <ol className={`ann__col ann__col--${side}`}>
      {callouts.map((c, i) => (sideOf(c) === side ? (
        <li
          key={i}
          ref={el => { labelRefs.current[i] = el; }}
          className={`ann__label${hot === i ? ' is-hot' : ''}${hot !== null && hot !== i ? ' is-dim' : ''}`}
          style={{ top: layout.tops[i] ?? 0, '--i': i } as CSSProperties}
          onMouseEnter={() => setHot(i)}
          onMouseLeave={() => setHot(null)}
        >
          <span className="ann__index" aria-hidden="true">{i + 1}</span>
          <b>{c.title}</b>
          <p>{c.body}</p>
        </li>
      ) : null))}
    </ol>
  );

  return (
    // className stays constant here: the reveal system adds `is-in` to this element itself
    <figure ref={figureRef} data-reveal="fade" className="ann">
      <div ref={stageRef} className={`ann__stage ann__stage--${screen.device}${live ? ' is-live' : ''}`} style={{ '--min': `${layout.minHeight}px` } as CSSProperties}>
        {column('left')}
        <div ref={deviceRef} className="ann__device">
          {screen.device === 'phone'
            ? <Phone shot={screen.shot}>{pins}</Phone>
            : <Browser shot={screen.shot} url={screen.url}>{pins}</Browser>}
        </div>
        {column('right')}
        <svg className="ann__lines" aria-hidden="true">
          {layout.lines.map((d, i) => (d ? (
            <path key={i} d={d} pathLength={1} className={`ann__line${hot === i ? ' is-hot' : ''}${hot !== null && hot !== i ? ' is-dim' : ''}`} style={{ '--i': i } as CSSProperties} />
          ) : null))}
        </svg>
      </div>
    </figure>
  );
}

/* ── The record: the system's core object, typeset row by row ──────────── */
function Record({ record }: { record: RecordView }) {
  const ref = useRevealRef<HTMLDListElement>(false);
  return (
    <dl ref={ref} data-reveal="fade" className="rec2">
      {record.rows.map((row, i) => (
        <div key={`${row.key}-${i}`} className={`rec2__row${row.nested ? ' is-nested' : ''}`} style={{ '--i': i } as CSSProperties}>
          <dt className="mono rec2__key">{row.key}</dt>
          <dd className="rec2__value">{row.value}</dd>
          <dd className="rec2__note">{row.note}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── The trace: one action followed through the system ─────────────────── */
function Trace({ trace }: { trace: TraceView }) {
  const ref = useRevealRef<HTMLOListElement>(false);
  const [rule, setRule] = useState(0);
  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const fit = () => { const last = list.querySelector<HTMLElement>('.trace__step:last-child'); if (last) setRule(last.offsetTop + 10); };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(list);
    return () => resize.disconnect();
  }, [ref, trace]);
  return (
    <ol ref={ref} data-reveal="fade" className="trace" style={{ '--rule': `${rule}px` } as CSSProperties}>
      {trace.steps.map((step, i) => (
        <li key={i} className="trace__step" style={{ '--i': i } as CSSProperties}>
          <span className="mono trace__lane">{step.lane}</span>
          <p className="trace__text">{step.text}</p>
          {step.detail ? <span className="trace__detail">{step.detail}</span> : null}
        </li>
      ))}
    </ol>
  );
}

/* ── Four views behind one switch ──────────────────────────────────────── */
type ViewId = 'screen' | 'scene' | 'record' | 'trace';
function Views({ block }: { block: BuildBlock }) {
  const tabs: { id: ViewId; label: string; title: string }[] = [];
  if (block.scene) tabs.push({ id: 'scene', label: 'Structure', title: block.scene.title });
  tabs.push({ id: 'screen', label: 'Screen', title: block.screen.label ?? 'The screen, annotated' });
  if (block.record) tabs.push({ id: 'record', label: 'Data', title: block.record.title });
  if (block.trace) tabs.push({ id: 'trace', label: 'Trace', title: block.trace.title });
  const [view, setView] = useState<ViewId>(block.scene ? 'scene' : 'screen');
  const active = tabs.find(tab => tab.id === view) ?? tabs[0];
  return (
    <div className="views">
      <Reveal kind="fade" className="views__bar">
        <span className="mono views__title" aria-live="polite">{active.title}</span>
        {tabs.length > 1 ? (
          <div className="views__tabs" role="tablist" aria-label="Views of the build">
            {tabs.map(tab => (
              <button key={tab.id} type="button" role="tab" aria-selected={tab.id === view} className={`views__tab${tab.id === view ? ' is-on' : ''}`} onClick={() => setView(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}
      </Reveal>
      {/* keyed so a view runs its entrance each time it is chosen */}
      <div key={view} className="views__panel" role="tabpanel">
        {view === 'screen' ? <Annotated screen={block.screen} /> : null}
        {view === 'scene' && block.scene ? <Scene scene={block.scene} /> : null}
        {view === 'record' && block.record ? <Record record={block.record} /> : null}
        {view === 'trace' && block.trace ? <Trace trace={block.trace} /> : null}
      </div>
    </div>
  );
}

/**
 * "Under the hood": a short spec column beside the headline, then three views
 * of the build: the screen annotated, the record it keeps, one action traced.
 */
export function Build({ block }: { block: BuildBlock }) {
  return (
    <section className="block block--build shell">
      <div className="build__head">
        <div className="block__head">
          <Reveal kind="fade" className="mono block__eyebrow">{block.eyebrow}</Reveal>
          <SplitText as="h2" className="h2 block__title" text={block.title} />
          {block.intro ? <Reveal delay={160}><p className="body-l muted block__intro">{block.intro}</p></Reveal> : null}
        </div>
        <Reveal as="dl" delay={140} className="spec" aria-label="Specification">
          {block.specs.map((item, index) => (
            <div key={item.label} className="spec__row" style={{ '--i': index } as CSSProperties}>
              <dt className="mono">{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </Reveal>
      </div>

      <Views block={block} />

      {block.note || block.source ? (
        <Reveal kind="fade" className="build__foot">
          {block.note ? <p className="block__note muted">{block.note}</p> : null}
          {block.source ? (
            <a className="btn btn--ghost" href={block.source.href} target="_blank" rel="noopener noreferrer">
              {block.source.label} <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ) : null}
        </Reveal>
      ) : null}
    </section>
  );
}
